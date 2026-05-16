#!/usr/bin/env node
/**
 * map-trips.js — Zet Corendon TradeTracker feed om naar trips.json
 *
 * Groepeert per hotel, filtert op koppelgeschiktheid,
 * en genereert het variants-schema uit bouwplan v3.
 *
 * Input:  feed-parser/raw-feed.json
 * Output: feed-parser/trips.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────

const RELEVANT_COUNTRIES = new Set([
  'Griekenland', 'Turkije', 'Spanje', 'Portugal', 'Italië',
  'Bulgarije', 'Egypte', 'Marokko', 'Kaapverdië',
  'Curaçao', 'Bonaire', 'Verenigde Arabische Emiraten',
]);

const MIN_STARS = 3;

const MAAND_MAP = {
  '01': 'januari', '02': 'februari', '03': 'maart', '04': 'april',
  '05': 'mei', '06': 'juni', '07': 'juli', '08': 'augustus',
  '09': 'september', '10': 'oktober', '11': 'november', '12': 'december',
};

const VLUCHTDUUR_MAP = {
  'Griekenland': '3u', 'Turkije': '3u30', 'Spanje': '2u30',
  'Portugal': '2u45', 'Italië': '2u15', 'Bulgarije': '2u45',
  'Egypte': '5u', 'Marokko': '3u30', 'Kaapverdië': '6u',
  'Curaçao': '9u30', 'Bonaire': '9u30',
  'Verenigde Arabische Emiraten': '6u30',
};

const AIRPORT_MAP = {
  'AMS': 'AMS', 'EIN': 'EIN', 'RTM': 'RTM', 'GRQ': 'GRQ',
  'MST': 'MST', 'AMB': 'AMS',
};

// ── Helpers ─────────────────────────────────────────────────────────────

function prop(product, key, fallback = '') {
  const arr = product.properties?.[key];
  return arr?.[0] ?? fallback;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[çć]/g, 'c').replace(/[ü]/g, 'u').replace(/[ö]/g, 'o')
    .replace(/[éèê]/g, 'e').replace(/[áàâ]/g, 'a').replace(/[íìî]/g, 'i')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseDateToMaand(dateStr) {
  // Format: dd/mm/yyyy
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return MAAND_MAP[parts[1]] || null;
}

function parseDuration(product) {
  const d = parseInt(prop(product, 'duration', '0'), 10);
  const type = prop(product, 'durationType', 'dagen');
  // Feed geeft "8 dagen" = 7 nachten
  return type === 'dagen' ? d - 1 : d;
}

function deriveSfeer(product) {
  // Alleen tags die de UI als sfeer-keuze biedt (start.html stap 1):
  //   strand, rustig, zon, actief, natuur, avontuur, resort, comfort, allinclusive
  // Andere descriptieve tags (pool, wellness, luxe, adults-only) horen in tags,
  // niet in sfeer — ze tellen daar wel mee voor scoreTripSmart-learning.
  const sfeer = [];
  const service = prop(product, 'serviceType').toLowerCase();
  const stars = parseInt(prop(product, 'stars', '0'), 10);
  const desc = (
    prop(product, 'descriptionShort') + ' ' +
    prop(product, 'descriptionLong', '') + ' ' +
    product.name
  ).toLowerCase();

  // ── UI-matchbare sfeer-tags ──
  if (service.includes('all inclusive') || service.includes('ultra all')) sfeer.push('allinclusive');
  if (stars >= 4) sfeer.push('comfort');
  if (desc.includes('strand') || desc.includes('beach') || desc.includes('zee')) sfeer.push('strand');
  if (desc.includes('rustig') || desc.includes('boutique')) sfeer.push('rustig');
  if (desc.includes('resort')) sfeer.push('resort');

  // ── Actief/natuur/avontuur: strenger dan eerder, vereist concrete activiteits-woorden ──
  // Voorkomt dat een resort met "uitzicht op bergen" ten onrechte 'natuur' krijgt.
  if (desc.match(/\b(wandel(en|tocht|paden|route)?|hike|fietst?(en|tour|route)?|duik(en|spot|plek)?|snorkel(en|spot)?|excursie|kajak|surf)\b/)) {
    sfeer.push('actief');
  }
  if (desc.match(/\b(natuurpark|nationaal park|wandelroute|bergen|bos(sen)?|vulkaanlandschap|kustpad|grotten)\b/)) {
    sfeer.push('natuur');
  }
  if (desc.match(/\b(avontuur(lijk)?|verkennen|ontdekken|expeditie|safari|jeep-?tour|quad)\b/)) {
    sfeer.push('avontuur');
  }

  // Fallback: zonvakanties zonder duidelijke sfeer krijgen 'zon'
  if (sfeer.length === 0) sfeer.push('zon');

  return [...new Set(sfeer)];
}

function deriveTags(product) {
  // Tags voeden scoreTripSmart-learning tijdens swipen — rijker dan sfeer,
  // niet beperkt tot UI-buttons. Pool/wellness/luxe/adults-only zitten hier
  // (en NIET in sfeer) zodat ze swipe-signaal geven zonder de filter te verstoren.
  const tags = [];
  const service = prop(product, 'serviceType').toLowerCase();
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const stars = parseInt(prop(product, 'stars', '0'), 10);
  const desc = (prop(product, 'descriptionShort') + ' ' + prop(product, 'descriptionLong', '')).toLowerCase();

  if (adultsOnly) tags.push('adults-only');
  if (service.includes('all inclusive')) tags.push('allinclusive');
  if (service.includes('ultra all')) tags.push('ultra-allinclusive');
  if (service.includes('halfpension')) tags.push('halfpension');
  if (stars >= 5) tags.push('5-sterren', 'luxe');
  else if (stars >= 4) tags.push('4-sterren');
  else if (stars >= 3) tags.push('3-sterren');

  if (desc.includes('strand') || desc.includes('beach')) tags.push('strand');
  if (desc.includes('zwembad') || desc.includes('pool')) tags.push('pool');
  if (desc.includes('spa') || desc.includes('wellness')) tags.push('wellness');
  if (desc.includes('fitness')) tags.push('fitness');
  if (desc.includes('animatie') || desc.includes('entertainment')) tags.push('entertainment');
  if (desc.includes('centrum') || desc.includes('center')) tags.push('centraal');
  if (desc.includes('duik') || desc.includes('snorkel')) tags.push('snorkelen');
  if (desc.includes('wifi')) tags.push('wifi');
  if (desc.match(/\b(wandel|hike|fiets)\b/)) tags.push('wandelen');
  if (desc.match(/\bromantisch|honeymoon\b/)) tags.push('romantisch');

  return [...new Set(tags)];
}

function deriveHighlights(product) {
  const highlights = [];
  const stars = prop(product, 'stars', '0');
  const rating = prop(product, 'rating', '');
  const service = prop(product, 'serviceType');
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const desc = prop(product, 'descriptionLong', '').toLowerCase();

  if (stars && parseInt(stars) >= 4) highlights.push(`${stars}-sterren accommodatie`);
  if (rating) highlights.push(`Gastwaardering: ${rating}`);
  if (service) highlights.push(service);
  if (adultsOnly) highlights.push('Adults only');
  if (prop(product, 'flightIncluded') === 'true') highlights.push('Vlucht inbegrepen');

  // Parse description for specifics
  const strandMatch = desc.match(/strand[^\n]*?op circa (\d+) meter/);
  if (strandMatch) highlights.push(`Strand op ${strandMatch[1]}m`);

  const zwembadMatch = desc.match(/(\d+) buitenzwembad/);
  if (zwembadMatch) highlights.push(`${zwembadMatch[1]} buitenzwembad(en)`);

  return highlights.slice(0, 5);
}

function deriveTitle(product) {
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const service = prop(product, 'serviceType').toLowerCase();
  const stars = parseInt(prop(product, 'stars', '0'), 10);
  const city = prop(product, 'city');
  const region = prop(product, 'region', city);

  const parts = [];

  if (adultsOnly) parts.push('Adults only');
  else if (service.includes('ultra all')) parts.push('Ultra all-inclusive');
  else if (service.includes('all inclusive')) parts.push('All-inclusive');
  else if (stars >= 5) parts.push('Luxe');
  else if (service.includes('halfpension')) parts.push('Halfpension');
  else parts.push('Zonvakantie');

  const accType = prop(product, 'accommodationType', 'hotel').toLowerCase();
  if (accType === 'hotel' || accType === 'aparthotel') {
    parts.push(stars >= 5 ? 'resort' : 'hotel');
  } else if (accType === 'appartement' || accType === 'villa') {
    parts.push(accType);
  } else {
    parts.push('verblijf');
  }

  parts.push(region || city);
  return parts.join(' ');
}

function deriveMatchReason(product) {
  // v3: hotel-specifiek door {concept} in {city/country} — {feature} te combineren.
  // Doel: top 3 toont niet 3x dezelfde generieke tekst.
  const country = prop(product, 'country');
  const city = prop(product, 'city');
  const stars = parseInt(prop(product, 'stars', '0'), 10);
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const service = prop(product, 'serviceType').toLowerCase();
  const ratingRaw = prop(product, 'rating', '');
  const rating = parseFloat(ratingRaw.replace(',', '.')) || 0;
  const price = product.price?.amount || 0;
  const desc = (
    prop(product, 'descriptionShort', '') + ' ' +
    prop(product, 'descriptionLong', '')
  ).toLowerCase();

  // 1. Concept (één label)
  let concept;
  if (adultsOnly && (service.includes('all inclusive') || service.includes('ultra all'))) concept = 'Adults only all-inclusive';
  else if (adultsOnly) concept = 'Adults only';
  else if (service.includes('ultra all')) concept = 'Ultra all-inclusive';
  else if (service.includes('all inclusive')) concept = 'All-inclusive';
  else if (stars >= 5) concept = 'Luxe verblijf';
  else if (service.includes('halfpension')) concept = 'Halfpension';
  else concept = 'Zonvakantie';

  // 2. Locatie: stad als zinvol, anders alleen land
  const locatie = city && city.toLowerCase() !== country.toLowerCase()
    ? `${city}, ${country}`
    : country;

  // 3. Hotel-specifiek feature (eerste match wint, gekozen op herkenbaarheid)
  let feature = '';
  if (desc.match(/\bprivéstrand|eigen strand|eigen baai\b/)) feature = 'met privéstrand';
  else if (desc.includes('infinity')) feature = 'met infinity pool';
  else if (desc.match(/\baan zee|strandlocatie|aan het strand\b/)) feature = 'direct aan zee';
  else if (desc.match(/\boude stad|historisch centrum|vlakbij het centrum\b/)) feature = 'vlakbij het centrum';
  else if (desc.includes('rooftop') || desc.includes('dakterras')) feature = 'met rooftop';
  else if (desc.match(/\bspa|wellness\b/) && stars >= 4) feature = 'met spa & wellness';
  else if (desc.match(/\b(swim[- ]?up|swimup|kamer met zwembad)\b/)) feature = 'met swim-up kamer';
  else if (rating >= 8.8) feature = `${ratingRaw}/10 reviews`;
  else if (stars === 5) feature = '5 sterren';
  else if (price > 0 && price < 500) feature = 'scherp geprijsd';

  return feature
    ? `${concept} in ${locatie} — ${feature}`
    : `${concept} in ${locatie}`;
}

function deriveWhyThisTrip(product) {
  const city = prop(product, 'city');
  const country = prop(product, 'country');
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const service = prop(product, 'serviceType');
  const shortDesc = prop(product, 'descriptionShort', '');

  if (shortDesc.length > 20 && shortDesc.length < 200) {
    return shortDesc.replace(/\s+/g, ' ').trim();
  }

  if (adultsOnly) return `${city} is een perfecte keuze voor koppels — adults only en op loopafstand van het strand.`;
  if (service.toLowerCase().includes('all inclusive')) return `${service} in ${city}: ontspannen zonder na te denken over de rekening.`;
  return `${city} in ${country} — een mooie bestemming voor jullie zonvakantie.`;
}

function deriveDescription(product) {
  const short = prop(product, 'descriptionShort', '');
  if (short.length > 30) return short.replace(/\s+/g, ' ').trim().slice(0, 250);

  const city = prop(product, 'city');
  const country = prop(product, 'country');
  return `Ontdek ${product.name} in ${city}, ${country}. Boek direct bij Corendon.`;
}

function getBoardType(product) {
  const s = prop(product, 'serviceType');
  const map = {
    'All Inclusive': 'All-inclusive',
    'Ultra All Inclusive': 'Ultra all-inclusive',
    'Halfpension': 'Halfpension',
    'Halfpension Plus': 'Halfpension Plus',
    'Volpension': 'Volpension',
    'Logies en ontbijt': 'Ontbijt',
    'Logies': 'Logies',
  };
  return map[s] || s || 'Logies';
}

// ── Main mapping ────────────────────────────────────────────────────────

function mapProduct(product) {
  const country = prop(product, 'country');
  if (!RELEVANT_COUNTRIES.has(country)) return null;

  const stars = parseInt(prop(product, 'stars', '0'), 10);
  if (stars < MIN_STARS) return null;

  // Skip cruises en andere niet-hotel types
  const accType = prop(product, 'accommodationType', '').toLowerCase();
  if (accType.includes('cruise') || accType.includes('cabin')) return null;

  const dateStr = prop(product, 'departureDate');
  const maand = parseDateToMaand(dateStr);
  if (!maand) return null;

  const duur = parseDuration(product);
  if (duur < 2) return null;

  const airport = AIRPORT_MAP[prop(product, 'iataDeparture', 'AMS')] || 'AMS';
  const price = product.price?.amount;
  if (!price || price < 50) return null;

  const city = prop(product, 'city');
  const region = prop(product, 'region', city);
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const code = prop(product, 'accommodationcode', product.ID);

  // ID: slugified hotel name + code
  const id = `corendon-${slugify(product.name)}-${code.toLowerCase()}`;

  // Eerste afbeelding (hoge kwaliteit)
  const imageUrl = product.images?.[0] || prop(product, 'productimage_1', '');

  return {
    id,
    title: deriveTitle(product),
    destination: `${region}, ${country}`,
    hotelName: product.name,
    sfeer: deriveSfeer(product),
    aanbieder: 'Corendon',
    boardType: getBoardType(product),
    vluchtduur: VLUCHTDUUR_MAP[country] || '3u',
    adultsOnly,
    audience: adultsOnly ? 'couples' : 'couples',
    matchReason: deriveMatchReason(product),
    whyThisTrip: deriveWhyThisTrip(product),
    tags: deriveTags(product),
    highlights: deriveHighlights(product),
    description: deriveDescription(product),
    imageUrl,
    affiliatePartner: 'Corendon',
    variants: [
      {
        maand,
        duur,
        airport,
        prijs: price,
        affiliateUrl: product.URL,
      },
    ],
    prijsPeilDatum: new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }),
    // Extra metadata voor filtering/sorting
    _meta: {
      stars,
      rating: prop(product, 'rating', '0').replace(',', '.'),
      country,
      region,
      city,
      lat: prop(product, 'latitude'),
      lon: prop(product, 'longitude'),
      accommodationCode: code,
    },
  };
}

// ── Run ─────────────────────────────────────────────────────────────────

const rawPath = join(__dirname, 'raw-feed.json');
const outPath = join(__dirname, 'trips.json');

console.log('📦 Feed laden…');
const raw = JSON.parse(readFileSync(rawPath, 'utf-8'));
const products = raw.products || raw;
console.log(`   ${products.length} producten in de feed`);

console.log('🔄 Mapping…');
const mapped = products.map(mapProduct).filter(Boolean);
console.log(`   ${mapped.length} trips na filtering`);

// Stats
const countries = {};
const adultsCount = mapped.filter(t => t.adultsOnly).length;
mapped.forEach(t => {
  const c = t._meta.country;
  countries[c] = (countries[c] || 0) + 1;
});

console.log('\n📊 Verdeling:');
Object.entries(countries)
  .sort((a, b) => b[1] - a[1])
  .forEach(([c, n]) => console.log(`   ${c}: ${n}`));
console.log(`   Adults only: ${adultsCount}`);

writeFileSync(outPath, JSON.stringify(mapped, null, 2), 'utf-8');
console.log(`\n💾 Opgeslagen: ${outPath}`);
