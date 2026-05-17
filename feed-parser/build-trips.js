#!/usr/bin/env node
/**
 * build-trips.js — Genereert trips.js voor de browser
 *
 * Combineert:
 *   1. Bestaande handmatige trips (TUI/Sunweb) — worden behouden
 *   2. Corendon-trips uit trips.json — gecureerd naar ~250-350 beste trips
 *
 * Curatiestrategie:
 *   - Alleen 4+ sterren
 *   - Alleen AMS/EIN vertrek (90% van de doelgroep)
 *   - Rating ≥ 7.0 (of geen rating)
 *   - Max per regio voor spreiding
 *   - Adults-only krijgt prioriteit (kernpubliek)
 *   - Prijsdiversiteit binnen elke bestemming
 *
 * Output: ../trips.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const feedTripsPath = join(__dirname, 'trips.json');
const outputPath = join(__dirname, '..', 'trips.js');

// ── Config ──────────────────────────────────────────────────────────────

const MAX_TOTAL = 200;          // Maximaal aantal Corendon-trips (was 300)
const MIN_STARS = 4;            // Minimaal 4 sterren
const MIN_RATING = 7.5;         // Minimaal 7.5 rating (was 7.0) — strenger cureren
const ALLOWED_AIRPORTS = new Set(['AMS', 'EIN']);
const MAX_PER_REGION = 8;       // Max trips per regio (was 12) — meer regio-diversiteit
const MAX_PER_COUNTRY = 25;     // Max trips per land (was 60) — voorkomt Turkije/Spanje-dominantie
const ADULTS_ONLY_BOOST = 50;   // Scoresbonus voor adults-only

// Behoud handmatige TUI/Sunweb/D-reizen trips? Tijdelijk uit: ze gebruiken
// dummy affiliateUrls (geen TradeTracker-deal). Zet op true zodra TUI/Sunweb
// affiliate-relaties geregeld zijn en hun trips echte commissie genereren.
const KEEP_MANUAL_TRIPS = false;

// Prioriteitslanden (matchen met Kiespret SEO-content)
const PRIORITY_COUNTRIES = new Set([
  'Griekenland', 'Turkije', 'Spanje', 'Portugal', 'Italië',
  'Bulgarije', 'Egypte', 'Marokko',
]);

// ── Helpers ──────────────────────────────────────────────────────────────

function parseExistingTrips(filePath) {
  if (!KEEP_MANUAL_TRIPS) return [];
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/const trips\s*=\s*\[/);
    if (!match) return [];
    const fn = new Function(content + '\nreturn trips;');
    return fn().filter(t => !t.id.startsWith('corendon-'));
  } catch {
    return [];
  }
}

function cleanTrip(trip) {
  const { _meta, ...clean } = trip;
  return clean;
}

function scoreTrip(trip) {
  const m = trip._meta;
  let score = 0;

  // Sterren (4=40, 5=60)
  score += (m.stars || 0) * 12;

  // Rating (7.0=70, 8.5=85, 9.0=90)
  const rating = parseFloat(m.rating) || 0;
  if (rating > 0) score += rating * 10;
  else score += 70; // Geen rating = neutrale score

  // Adults only bonus (kernpubliek Kiespret)
  if (trip.adultsOnly) score += ADULTS_ONLY_BOOST;

  // All-inclusive bonus (populairste boardtype voor koppels)
  if (trip.boardType.toLowerCase().includes('all-inclusive') ||
      trip.boardType.toLowerCase().includes('ultra all')) {
    score += 20;
  }

  // Prioriteitsland bonus
  if (PRIORITY_COUNTRIES.has(m.country)) score += 15;

  // Prijsbonus: goedkopere trips scoren hoger (meer toegankelijk)
  const prijs = trip.variants[0]?.prijs || 9999;
  if (prijs < 500) score += 15;
  else if (prijs < 800) score += 10;
  else if (prijs < 1200) score += 5;

  return score;
}

// ── Curatie ──────────────────────────────────────────────────────────────

function curateTrips(trips) {
  console.log('🎯 Curatie starten…');

  // Stap 1: Harde filters
  let filtered = trips.filter(t => {
    const m = t._meta;
    if ((m.stars || 0) < MIN_STARS) return false;

    const airport = t.variants[0]?.airport;
    if (!ALLOWED_AIRPORTS.has(airport)) return false;

    const rating = parseFloat(m.rating) || 0;
    if (rating > 0 && rating < MIN_RATING) return false;

    // Minimaal 4 nachten (korte stedentrips vallen buiten scope)
    const duur = t.variants[0]?.duur || 0;
    if (duur < 4) return false;

    return true;
  });

  console.log(`   Na harde filters: ${filtered.length} trips`);

  // Stap 2: Score en sorteer
  filtered.forEach(t => { t._score = scoreTrip(t); });
  filtered.sort((a, b) => b._score - a._score);

  // Stap 3: Spreidingslimiet per regio én per land
  const regionCount = {};
  const countryCount = {};
  const selected = [];

  for (const trip of filtered) {
    const region = trip._meta.region || trip._meta.city;
    const country = trip._meta.country;

    if ((regionCount[region] || 0) >= MAX_PER_REGION) continue;
    if ((countryCount[country] || 0) >= MAX_PER_COUNTRY) continue;

    regionCount[region] = (regionCount[region] || 0) + 1;
    countryCount[country] = (countryCount[country] || 0) + 1;
    selected.push(trip);

    if (selected.length >= MAX_TOTAL) break;
  }

  console.log(`   Na spreiding + limiet: ${selected.length} trips`);

  // Stats
  const countries = {};
  let adultsCount = 0;
  selected.forEach(t => {
    const c = t._meta.country;
    countries[c] = (countries[c] || 0) + 1;
    if (t.adultsOnly) adultsCount++;
  });

  console.log('\n📊 Gecureerde verdeling:');
  Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .forEach(([c, n]) => console.log(`   ${c}: ${n}`));
  console.log(`   Adults only: ${adultsCount}`);

  const prices = selected.map(t => t.variants[0].prijs);
  console.log(`   Prijsrange: €${Math.min(...prices)} – €${Math.max(...prices)}`);

  return selected;
}

// ── Build ──────────────────────────────────────────────────────────────

console.log('📦 Feed-trips laden…');
const feedTrips = JSON.parse(readFileSync(feedTripsPath, 'utf-8'));
console.log(`   ${feedTrips.length} Corendon-trips in de feed`);

console.log('📂 Bestaande handmatige trips laden…');
const manualTrips = parseExistingTrips(outputPath);
console.log(`   ${manualTrips.length} handmatige trips (TUI/Sunweb) behouden\n`);

// Curatie
const curated = curateTrips(feedTrips);

// Combineer: handmatige trips eerst, dan gecureerde Corendon
const allTrips = [...manualTrips, ...curated.map(cleanTrip)];

// ── Schrijf trips.js ──

const header = `// trips.js — Kiespret dataset
// Automatisch gegenereerd door feed-parser/build-trips.js
// Laatste update: ${new Date().toISOString().split('T')[0]}
//
// Handmatige trips (TUI/Sunweb): ${manualTrips.length}
// Corendon feed-trips: ${curated.length} (gecureerd uit ${feedTrips.length})
// Totaal: ${allTrips.length}
//
// Scope: uitsluitend zonvakanties voor Nederlandse koppels 28–45
// Curatie: 4+ sterren, rating ≥ ${MIN_RATING}, AMS/EIN, max ${MAX_PER_REGION}/regio, max ${MAX_PER_COUNTRY}/land
// Prijs: per persoon inclusief vlucht

const trips = `;

const output = header + JSON.stringify(allTrips, null, 2) + ';\n';

writeFileSync(outputPath, output, 'utf-8');

const sizeKB = (Buffer.byteLength(output, 'utf-8') / 1024).toFixed(0);
console.log(`\n💾 trips.js geschreven (${sizeKB} KB)`);
console.log(`   ${allTrips.length} trips totaal`);
console.log(`   ${outputPath}`);
