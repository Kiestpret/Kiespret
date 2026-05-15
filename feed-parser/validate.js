#!/usr/bin/env node
/**
 * validate.js — Valideert trips.json tegen het JSON Schema
 *
 * Gebruik: node validate.js
 * Exit 0 = alles goed, Exit 1 = fouten gevonden
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const schema = JSON.parse(readFileSync(join(__dirname, 'trips.schema.json'), 'utf-8'));
const trips = JSON.parse(readFileSync(join(__dirname, 'trips.json'), 'utf-8'));

let errors = 0;
const ids = new Set();

for (let i = 0; i < trips.length; i++) {
  const t = trips[i];
  const loc = `trip[${i}] "${t.id || 'NO_ID'}"`;

  // Required fields check
  for (const field of schema.items.required) {
    if (t[field] === undefined || t[field] === null) {
      console.error(`❌ ${loc}: verplicht veld '${field}' ontbreekt`);
      errors++;
    }
  }

  // ID format
  if (t.id && !/^[a-z0-9-]+$/.test(t.id)) {
    console.error(`❌ ${loc}: id bevat ongeldige tekens`);
    errors++;
  }

  // Duplicate ID
  if (ids.has(t.id)) {
    console.error(`❌ ${loc}: dubbel ID`);
    errors++;
  }
  ids.add(t.id);

  // Variants
  if (!Array.isArray(t.variants) || t.variants.length === 0) {
    console.error(`❌ ${loc}: geen variants`);
    errors++;
    continue;
  }

  for (let j = 0; j < t.variants.length; j++) {
    const v = t.variants[j];
    const vloc = `${loc} variant[${j}]`;

    if (!v.maand) { console.error(`❌ ${vloc}: maand ontbreekt`); errors++; }
    if (!v.duur || v.duur < 1) { console.error(`❌ ${vloc}: ongeldige duur ${v.duur}`); errors++; }
    if (!v.prijs || v.prijs < 50) { console.error(`❌ ${vloc}: ongeldige prijs ${v.prijs}`); errors++; }
    if (!v.affiliateUrl?.startsWith('https://')) {
      console.error(`❌ ${vloc}: ongeldige affiliateUrl`);
      errors++;
    }
  }

  // Title length
  if (t.title && t.title.length > 80) {
    console.error(`⚠️  ${loc}: titel te lang (${t.title.length} chars)`);
    errors++;
  }

  // Image URL
  if (!t.imageUrl || !t.imageUrl.startsWith('https://')) {
    console.error(`⚠️  ${loc}: geen geldige imageUrl`);
    errors++;
  }
}

// Stats
console.log(`\n📋 Validatie voltooid`);
console.log(`   ${trips.length} trips gecontroleerd`);
console.log(`   ${ids.size} unieke IDs`);
console.log(`   ${errors} fouten gevonden`);

if (errors > 0) {
  console.error(`\n❌ Validatie MISLUKT — ${errors} fouten`);
  process.exit(1);
} else {
  console.log(`\n✅ Validatie GESLAAGD`);
  process.exit(0);
}
