#!/usr/bin/env node
/**
 * map-trips.js — Zet Corendon TradeTracker feed om naar trips.json
 *
 * Variant-accumulatie: laadt bestaande trips.json en merget nieuwe
 * feed-producten als varianten bij bestaande hotels. Zo bouw je over
 * meerdere dagen een complete set maand/prijs-combinaties per hotel op.
 *
 * - Bestaand hotel + nieuwe variant → variant wordt toegevoegd
 * - Bestaand hotel + zelfde variant → prijs/URL wordt bijgewerkt
 * - Nieuw hotel → nieuwe trip aangemaakt
 * - Varianten ouder dan MAX_VARIANT_AGE_DAYS → opgeruimd
 *
 * Input:  feed-parser/raw-feed.json + (optioneel) feed-parser/trips.json
 * Output: feed-parser/trips.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────

const MAX_VARIANT_AGE_DAYS = 14; // Varianten ouder dan 14 dagen opruimen

const RELEVANT_COUNTRIES = new Set([
  'Griekenland', 'Turkije', 'Spanje', 'Portugal', 'Italië',
  'Bulgarije', 'Egypte', 'Marokko', 'Kaapverdië',
  'Curaçao', 'Bonaire', 'Verenigde Arabische Emiraten',
]);

const MIN_STARS = 3;

// Last-minute aanbiedingen (< 14 dagen vooruit) zijn vaak niet meer beschikbaar
// tegen feed-prijs. Corendon toont dan een latere maand, wat onze vanaf-prijs
// op de kaart inconsistent maakt met wat de gebruiker bij doorklik ziet.
const MIN_DAYS_AHEAD = 14;

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

function decodeHtmlEntities(str) {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
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
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  return MAAND_MAP[parts[1]] || null;
}

function parseDateToDate(dateStr) {
  // Format: dd/mm/yyyy → Date
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : d;
}

function parseDuration(product) {
  const d = parseInt(prop(product, 'duration', '0'), 10);
  const type = prop(product, 'durationType', 'dagen');
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

  // ── Actief/natuur/avontuur: min 2 matches vereist ──
  // Voorkomt dat elk strandresort met één keer "excursie" in de tekst 'actief' krijgt.
  const actiefHits = (desc.match(/\b(wandel(en|tocht|paden|route)?|hik(e|ing)|fietst?(en|tour|route)?|duik(en|spot|plek)?|snorkel(en|spot)?|excursie|kajak|surf(en)?|sportief|actief)\b/g) || []).length;
  if (actiefHits >= 2) sfeer.push('actief');

  if (desc.match(/\b(natuurpark|nationaal park|wandelroute|bergen|bos(sen)?|vulkaanlandschap|kustpad|grotten)\b/)) {
    sfeer.push('natuur');
  }
  const avontuurHits = (desc.match(/\b(avontuur(lijk)?|verkennen|ontdekken|expeditie|safari|jeep-?tour|quad|off-?road)\b/g) || []).length;
  if (avontuurHits >= 2) sfeer.push('avontuur');

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

const destinationDescriptions = {
  'Kreta': 'Elafonissi, Balos Beach en bergdorpjes in de White Mountains. Het grootste Griekse eiland combineert strand met Venetiaanse haventjes en Kretenzische keuken.',
  'Zakynthos': 'Navagio Beach, schildpadden spotten bij Laganas Bay en boottochtjes naar de Blue Caves. Rustig Ionisch eiland met turquoise baaien.',
  'Rhodos': 'Middeleeuwse oude stad, Lindos met zijn acropolis en lange zandstranden aan de oostkust. Cultuur en strand op loopafstand.',
  'Kos': 'Compact eiland waar je alles op de fiets bereikt. Rustige stranden, Griekse taverna\'s in Kos-stad en de Asclepion-ruïnes.',
  'Corfu': 'Venetiaanse architectuur in Kerkyra, olijfboomgaarden en de beroemde Canal d\'Amour bij Sidari. Groener dan de meeste Griekse eilanden.',
  'Samos': 'Pythagorio, bergwandelingen en rustige kiezelstranden. Klein en authentiek eiland voor koppels die drukte willen vermijden.',
  'Lesbos': 'Versteend bos, warmwaterbronnen en pittoreske Molyvos. Authentiek Grieks eiland zonder massatoerisme.',
  'Lefkas': 'Porto Katsiki en Egremni — stranden met turquoise water omringd door witte kliffen. Rustig en bereikbaar via een brug.',
  'Parga': 'Kleurrijke Venetiaanse huizen aan een beschutte baai. Kasteel met panoramisch uitzicht en bootjes naar Paxos.',
  'Athene': 'Acropolis, Plaka-wijk en rooftopbars met uitzicht over de stad. Combineer een citytrip met een stranddag bij Vouliagmeni.',
  'Thessaloniki': 'Witte Toren, levendige Ladadika-wijk en de beste streetfood van Griekenland. Culturele havenstad aan de Egeïsche Zee.',
  'Alanya': 'Kleopatra Beach, de rode toren en boottochtjes langs grotten. Levendige badplaats met een historisch centrum op de rots.',
  'Side': 'Romeinse ruïnes naast het strand, de Manavgat-waterval en een gezellige oude binnenstad. Cultuur en zon in één.',
  'Antalya': 'Kaleiçi oude stad, Düden-watervallen en het Taurusgebergte als decor. Grote stad met strand, cultuur en nachtleven.',
  'Bodrum': 'Witte huisjes, het kasteel van Sint-Pieter en strandclubs aan de Egeïsche kust. De chiqueste badplaats van Turkije.',
  'Marmaris': 'Langgerekte boulevard, watertaxi naar Dalyan en schildpadden, en dagtrips naar het Griekse eiland Rhodos.',
  'Belek': 'Brede zandstranden, golfbanen en luxe resorts tussen de dennenbossen. Rustig en groen, vlakbij het oude Aspendos.',
  'Fethiye': 'Ölüdeniz Blue Lagoon, paragliden vanaf Babadağ en de Lycische rotsgraven. Natuur en avontuur aan de Turkse kust.',
  'Dalyan': 'Bootvaren door rietvelden naar Iztuzu-schildpaddenstrand en de Lycische koningsgraven. Rustig en natuurlijk.',
  'Kusadasi': 'Op een steenworp van Efeze, met een levendig centrum en stranden. Ideaal als je cultuur en strand wilt combineren.',
  'Kemer': 'Bossen, bergen en kiezelstranden aan de voet van het Taurusgebergte. Rustige tegenhanger van druk Antalya.',
  'Mallorca': 'Serra de Tramuntana, verborgen baaien (calas), Palma\'s kathedraal en wijngaarden in Binissalem. Veel meer dan massatoerisme.',
  'Ibiza': 'Zonsondergangen bij Café del Mar, verborgen baaien in het noorden en de oude stad Dalt Vila. Feest én rust op één eiland.',
  'Menorca': 'Ongerepte baaien, de oude hoofdstad Ciutadella en het langzaamste levenstempo van de Balearen. Perfecte digital detox.',
  'Tenerife': 'Teide-vulkaan, walvissen spotten en zwarte lavastranden in het zuiden. Van woestijnlandschap tot tropisch groen.',
  'Gran Canaria': 'Duinen van Maspalomas, het koloniale Vegueta in Las Palmas en bergdorpjes in het binnenland. Mini-continent.',
  'Fuerteventura': 'Eindeloze witte stranden, surfen bij El Cotillo en woestijnlandschap. Het rustigste Canarische eiland.',
  'Lanzarote': 'Vulkaanlandschap van Timanfaya, César Manrique-kunst en wijnbouw op lava. Anders dan elk ander eiland.',
  'La Palma': 'Sterrenwacht op de Roque, laurierbossen en wandelroutes door vulkaankraters. Het groenste Canarische eiland.',
  'Costa del Sol': 'Málaga\'s Picasso-museum, witte dorpen in de bergen en lange zandstranden. Strand met culturele diepgang.',
  'Costa Brava': 'Rotsachtige kustlijn, Dalí-museum in Figueres en middeleeuwse dorpjes. Ruiger dan de zuidkust.',
  'Costa Blanca': 'Benidorm\'s skyline, rustige baaien bij Jávea en Altea en palmenbos in Elche. Zon met Spaans dorpsleven eromheen.',
  'Costa de Almería': 'Woestijnlandschap van Tabernas, ongerepte stranden in Cabo de Gata en Moorse architectuur. Het droogste hoekje van Europa.',
  'Sicilië': 'Etna, Griekse tempels in Agrigento, straateten in Palermo en barokke steden als Noto. Cultuur, keuken en kust.',
  'Sardinië': 'Costa Smeralda, turquoise baaien bij Cala Gonone en nuraghen-ruïnes. Spectaculaire natuur en helder water.',
  'Hurghada': 'Rode Zee-snorkelen bij Giftun Island, woestijnsafari\'s en all-inclusive aan een eindeloos zandstrand.',
  'Marsa Alam': 'Dugongs spotten, huisriffen om vanaf het strand te snorkelen en rustige baaien. Rode Zee zonder de drukte van Hurghada.',
  'Sharm el Sheikh': 'Ras Mohammed-koraalriffen, duiken en snorkelen in de Rode Zee. Woestijn ontmoet onderwaterwereld.',
  'Algarve': 'Gouden kliffen, grotten bij Benagil, visrestaurants in Lagos en golfbanen. De zuidkust van Portugal op z\'n best.',
  'Madeira': 'Levada-wandelingen door laurierbos, Funchal\'s bloemenmarkt en eeuwig lenteweer. Groen eiland voor actieve koppels.',
  'Lissabon': 'Tram 28 door Alfama, pastéis de nata bij Belém en rooftopbars met uitzicht over de Taag. Charmante heuvels en azulejos.',
  'Porto': 'Portwijnkelders in Vila Nova de Gaia, Ribeira aan de Douro en art nouveau-cafés. Stoerder en rauwer dan Lissabon.',
  'Sunny Beach': 'Lang zandstrand aan de Zwarte Zee, betaalbare restaurants en een levendig uitgaansleven. Meeste waar voor je geld.',
  'Dubai': 'Burj Khalifa, woestijnsafari, souks en strandclubs. Skyline van de toekomst gecombineerd met woestijnavontuur.',
  'Willemstad': 'Handelskade in pastelkleuren, snorkelen bij Tugboat Beach en Blue Curaçao proeven. Caribisch met een Nederlandse twist.',
  'Kralendijk': 'Bonaire\'s huisriffen, flamingo\'s bij Gotomeer en windsurfen op Lac Bay. Het rustigste ABC-eiland.',
  'Istanbul': 'Hagia Sophia, Grote Bazaar, Bosporus-cruise en streetfood in Karaköy. Twee continenten in één stad.',
  'Agadir': 'Lange zandstranden, de souk en dagtrips naar het Atlasgebergte en Paradise Valley. Zon met Marokkaanse sfeer.',
  'Marrakech': 'Djemaa el-Fna, riads met binnentuinen, souks vol specerijen en de Jardin Majorelle. Zintuigelijke stadservaring.',
  'Sal': 'Santa Maria strand, zoutpannen van Pedra de Lume en walvissen spotten. Kaapverdische zon het hele jaar door.',
  'Abu Dhabi': 'Sheikh Zayed-moskee, Louvre Abu Dhabi en mangrove-kajakken. Rustiger dan Dubai met dezelfde woestijnwarmte.',
};

// Laag 1: bestemmingsbeschrijving (zelfde voor heel Zakynthos — foto-overlay)
function deriveDestinationDesc(product) {
  const region = prop(product, 'region', prop(product, 'city'));
  const country = prop(product, 'country');

  if (destinationDescriptions[region]) return destinationDescriptions[region];
  if (destinationDescriptions[country]) return destinationDescriptions[country];

  // Slimme fallback voor onbekende bestemmingen op basis van sfeer-tags
  const ao = prop(product, 'onlyadult') === 'true';
  const service = prop(product, 'serviceType');
  const isAI = service.toLowerCase().includes('all inclusive');
  const parts = [];
  if (ao) parts.push('alleen voor volwassenen');
  if (isAI) parts.push('volledig ontzorgd met all-inclusive');
  parts.push(`ontdek ${region} in ${country}`);
  return parts.join(' — ') + '.';
}

// Laag 2: trip-specifieke beschrijving (uniek per hotel — card body)
function deriveTripDesc(product) {
  const city = prop(product, 'city');
  const region = prop(product, 'region', city);
  const name = decodeHtmlEntities(product.name || '');
  const ao = prop(product, 'onlyadult') === 'true';
  const service = prop(product, 'serviceType');
  const stars = prop(product, 'stars', '');
  const rating = prop(product, 'rating', '');

  const parts = [];

  // Locatie-context als city verschilt van region
  if (city && city !== region && !city.startsWith('Bingoreizen') && !city.startsWith('Excursiereis') && !city.startsWith('Rondreizen')) {
    parts.push(`in ${city}`);
  }

  // Hotel-specifieke kenmerken
  if (ao) parts.push('adults only');
  if (service) {
    const svc = service.toLowerCase();
    if (svc.includes('all inclusive')) parts.push('all-inclusive');
    else if (svc.includes('halfpension')) parts.push('halfpension');
    else if (svc.includes('ontbijt')) parts.push('met ontbijt');
  }
  const starsNum = parseInt(stars);
  if (starsNum >= 3 && starsNum <= 5) parts.push(`${starsNum}-sterren`);

  // Gastwaardering als afsluiter
  const ratingNum = parseFloat(String(rating).replace(',', '.'));
  if (ratingNum >= 8.5) parts.push(`gastwaardering ${rating}`);
  else if (ratingNum >= 7.5) parts.push(`beoordeeld met een ${rating}`);

  if (parts.length === 0) return `${name} in ${region}.`;
  return parts.join(', ') + '.';
}

// Bewaar whyThisTrip als bestemmingsbeschrijving (backward compatible)
function deriveWhyThisTrip(product) {
  return deriveDestinationDesc(product);
}

// Log onbekende bestemmingen zodat we ze handmatig kunnen toevoegen
const unknownDestinations = new Set();
function flagUnknownDestination(product) {
  const region = prop(product, 'region', prop(product, 'city'));
  if (!destinationDescriptions[region]) {
    unknownDestinations.add(region);
  }
}

function deriveDescription(product) {
  const short = prop(product, 'descriptionShort', '');
  if (short.length > 30) return short.replace(/\s+/g, ' ').trim().slice(0, 250);

  const city = prop(product, 'city');
  const country = prop(product, 'country');
  return `Ontdek ${decodeHtmlEntities(product.name)} in ${city}, ${country}. Boek direct bij Corendon.`;
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

// ── Variant key (uniek per maand+duur+airport) ─────────────────────────

function variantKey(v) {
  return `${v.maand}|${v.duur}|${v.airport}`;
}

// ── Extract variant from feed product ──────────────────────────────────

function extractVariant(product) {
  const dateStr = prop(product, 'departureDate');
  const maand = parseDateToMaand(dateStr);
  if (!maand) return null;

  // Skip last-minute aanbiedingen — vaak niet meer boekbaar tegen feed-prijs,
  // wat leidt tot mismatch tussen onze vanaf-prijs en wat user op Corendon ziet.
  const departureDate = parseDateToDate(dateStr);
  if (departureDate) {
    const cutoff = new Date(Date.now() + MIN_DAYS_AHEAD * 24 * 60 * 60 * 1000);
    if (departureDate < cutoff) return null;
  }

  const duur = parseDuration(product);
  if (duur < 2) return null;

  const airport = AIRPORT_MAP[prop(product, 'iataDeparture', 'AMS')] || 'AMS';
  const price = product.price?.amount;
  if (!price || price < 50) return null;

  return {
    maand,
    duur,
    airport,
    prijs: price,
    affiliateUrl: product.URL,
    _addedAt: new Date().toISOString().split('T')[0], // voor veroudering
  };
}

// ── Build trip object from feed product (nieuw hotel) ──────────────────

function buildTrip(product, variant) {
  const country = prop(product, 'country');
  const city = prop(product, 'city');
  const region = prop(product, 'region', city);
  const adultsOnly = prop(product, 'onlyadult') === 'true';
  const code = prop(product, 'accommodationcode', product.ID);
  const stars = parseInt(prop(product, 'stars', '0'), 10);
  const imageUrl = product.images?.[1] || product.images?.[0] || prop(product, 'productimage_1', '');

  return {
    id: `corendon-${slugify(decodeHtmlEntities(product.name))}-${code.toLowerCase()}`,
    title: deriveTitle(product),
    destination: `${region}, ${country}`,
    hotelName: decodeHtmlEntities(product.name),
    sfeer: deriveSfeer(product),
    aanbieder: 'Corendon',
    boardType: getBoardType(product),
    vluchtduur: VLUCHTDUUR_MAP[country] || '3u',
    adultsOnly,
    audience: 'couples',
    matchReason: deriveMatchReason(product),
    whyThisTrip: decodeHtmlEntities(deriveWhyThisTrip(product)),
    tripDesc: decodeHtmlEntities(deriveTripDesc(product)),
    tags: deriveTags(product),
    highlights: deriveHighlights(product),
    description: decodeHtmlEntities(deriveDescription(product)),
    imageUrl,
    affiliatePartner: 'Corendon',
    variants: [variant],
    prijsPeilDatum: new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' }),
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

// ── Verouderde varianten opruimen ──────────────────────────────────────

function pruneOldVariants(trip) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_VARIANT_AGE_DAYS);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  trip.variants = trip.variants.filter(v => {
    // Varianten zonder _addedAt behouden (handmatige trips, legacy)
    if (!v._addedAt) return true;
    return v._addedAt >= cutoffStr;
  });

  // Update prijsPeilDatum op basis van meest recente variant
  if (trip.variants.length > 0) {
    const newest = trip.variants.reduce((a, b) =>
      (a._addedAt || '') > (b._addedAt || '') ? a : b
    );
    if (newest._addedAt) {
      const d = new Date(newest._addedAt);
      trip.prijsPeilDatum = d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    }
  }

  return trip.variants.length > 0;
}

// ── Filter: mag dit product meedoen? ───────────────────────────────────

function isEligible(product) {
  const country = prop(product, 'country');
  if (!RELEVANT_COUNTRIES.has(country)) return false;

  const stars = parseInt(prop(product, 'stars', '0'), 10);
  if (stars < MIN_STARS) return false;

  const accType = prop(product, 'accommodationType', '').toLowerCase();
  if (accType.includes('cruise') || accType.includes('cabin')) return false;

  return true;
}

// ── Run ─────────────────────────────────────────────────────────────────

const rawPath = join(__dirname, 'raw-feed.json');
const outPath = join(__dirname, 'trips.json');

// Stap 1: Laad bestaande trips (als die er zijn)
let existingTrips = [];
if (existsSync(outPath)) {
  try {
    existingTrips = JSON.parse(readFileSync(outPath, 'utf-8'));
    console.log(`📂 Bestaande trips.json geladen: ${existingTrips.length} hotels`);
  } catch {
    console.log('⚠️  trips.json kon niet gelezen worden, start met leeg bestand');
  }
}

// Bouw index op accommodationCode
const hotelIndex = new Map();
for (const trip of existingTrips) {
  const code = trip._meta?.accommodationCode;
  if (code) hotelIndex.set(code, trip);
}

// Stap 2: Laad nieuwe feed
console.log('📦 Feed laden…');
const raw = JSON.parse(readFileSync(rawPath, 'utf-8'));
const products = raw.products || raw;
console.log(`   ${products.length} producten in de feed`);

// Stap 3: Merge feed-producten met bestaande hotels
let newHotels = 0;
let updatedVariants = 0;
let newVariants = 0;
let skipped = 0;

for (const product of products) {
  if (!isEligible(product)) { skipped++; continue; }

  const variant = extractVariant(product);
  if (!variant) { skipped++; continue; }

  const code = prop(product, 'accommodationcode', product.ID);
  const existing = hotelIndex.get(code);

  if (existing) {
    // Hotel bestaat al → merge variant
    const key = variantKey(variant);
    const idx = existing.variants.findIndex(v => variantKey(v) === key);

    if (idx >= 0) {
      // Zelfde maand+duur+airport → update prijs en URL
      existing.variants[idx].prijs = variant.prijs;
      existing.variants[idx].affiliateUrl = variant.affiliateUrl;
      existing.variants[idx]._addedAt = variant._addedAt;
      updatedVariants++;
    } else {
      // Nieuwe combinatie → voeg variant toe
      existing.variants.push(variant);
      newVariants++;
    }

    // Herbereken metadata bij elke merge (sfeer-logica kan verbeterd zijn)
    existing.sfeer = deriveSfeer(product);
    existing.tags = deriveTags(product);
    existing.matchReason = deriveMatchReason(product);
    existing.highlights = deriveHighlights(product);
    existing.whyThisTrip = decodeHtmlEntities(deriveWhyThisTrip(product));
    existing.tripDesc = decodeHtmlEntities(deriveTripDesc(product));
    flagUnknownDestination(product);
  } else {
    // Nieuw hotel → maak trip aan
    const trip = buildTrip(product, variant);
    hotelIndex.set(code, trip);
    newHotels++;
    flagUnknownDestination(product);
  }
}

// Log onbekende bestemmingen
if (unknownDestinations.size > 0) {
  console.log(`\n⚠️  ${unknownDestinations.size} bestemmingen zonder handgeschreven beschrijving:`);
  for (const d of [...unknownDestinations].sort()) console.log(`   - ${d}`);
  console.log('   Voeg ze toe aan destinationDescriptions in map-trips.js');
}

console.log(`\n🔄 Merge resultaat:`);
console.log(`   ${newHotels} nieuwe hotels`);
console.log(`   ${newVariants} nieuwe varianten bij bestaande hotels`);
console.log(`   ${updatedVariants} bijgewerkte varianten (prijs/URL)`);
console.log(`   ${skipped} producten overgeslagen (filters)`);

// Stap 4: Decode HTML entities + genereer ontbrekende beschrijvingen
let descGenerated = 0;
for (const trip of hotelIndex.values()) {
  if (trip.hotelName) trip.hotelName = decodeHtmlEntities(trip.hotelName);
  if (trip.title) trip.title = decodeHtmlEntities(trip.title);
  if (trip.whyThisTrip) trip.whyThisTrip = decodeHtmlEntities(trip.whyThisTrip);
  if (trip.description) trip.description = decodeHtmlEntities(trip.description);

  // Bestemmingsbeschrijving bijwerken voor trips zonder custom beschrijving
  const region = (trip.destination || '').split(',')[0].trim();
  if (destinationDescriptions[region] && (!trip.whyThisTrip || trip.whyThisTrip.includes('mooie bestemming') || trip.whyThisTrip.includes('perfecte keuze voor koppels') || trip.whyThisTrip.includes('ontspannen zonder'))) {
    trip.whyThisTrip = destinationDescriptions[region];
  }

  // tripDesc genereren voor trips die het nog niet hebben
  if (!trip.tripDesc) {
    const parts = [];
    const city = (trip._meta?.city || '');
    if (city && city !== region && !city.startsWith('Bingoreizen') && !city.startsWith('Excursiereis') && !city.startsWith('Rondreizen')) {
      parts.push(`in ${city}`);
    }
    if (trip.adultsOnly) parts.push('adults only');
    const bt = (trip.boardType || '').toLowerCase();
    if (bt.includes('all-inclusive') || bt.includes('ultra all')) parts.push('all-inclusive');
    else if (bt.includes('halfpension')) parts.push('halfpension');
    else if (bt.includes('ontbijt')) parts.push('met ontbijt');
    const starsNum = parseInt(trip._meta?.stars || '0');
    if (starsNum >= 3 && starsNum <= 5) parts.push(`${starsNum}-sterren`);
    const ratingStr = trip._meta?.rating || '';
    const ratingNum = parseFloat(String(ratingStr).replace(',', '.'));
    if (ratingNum >= 8.5) parts.push(`gastwaardering ${ratingStr}`);
    else if (ratingNum >= 7.5) parts.push(`beoordeeld met een ${ratingStr}`);
    if (parts.length > 0) {
      trip.tripDesc = parts.join(', ') + '.';
      descGenerated++;
    }
  }
}
if (descGenerated > 0) console.log(`   ${descGenerated} tripDesc's gegenereerd voor bestaande trips`);

// Stap 5: Ruim verouderde varianten op
let pruned = 0;
const allTrips = [];
for (const trip of hotelIndex.values()) {
  const beforeCount = trip.variants.length;
  if (pruneOldVariants(trip)) {
    allTrips.push(trip);
    pruned += beforeCount - trip.variants.length;
  } else {
    pruned += beforeCount;
  }
}

if (pruned > 0) console.log(`   ${pruned} verouderde varianten opgeruimd`);

// Stats
const countries = {};
let adultsCount = 0;
let totalVariants = 0;
allTrips.forEach(t => {
  const c = t._meta.country;
  countries[c] = (countries[c] || 0) + 1;
  if (t.adultsOnly) adultsCount++;
  totalVariants += t.variants.length;
});

console.log(`\n📊 Resultaat:`);
console.log(`   ${allTrips.length} hotels, ${totalVariants} varianten totaal`);
console.log(`   Gemiddeld ${(totalVariants / allTrips.length).toFixed(1)} varianten per hotel`);
Object.entries(countries)
  .sort((a, b) => b[1] - a[1])
  .forEach(([c, n]) => console.log(`   ${c}: ${n}`));
console.log(`   Adults only: ${adultsCount}`);

writeFileSync(outPath, JSON.stringify(allTrips, null, 2), 'utf-8');
console.log(`\n💾 Opgeslagen: ${outPath}`);
