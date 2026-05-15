#!/usr/bin/env node
/**
 * fetch-feed.js — Haalt de Corendon productfeed op van TradeTracker
 *
 * Gebruik:
 *   node fetch-feed.js
 *
 * Environment:
 *   TRADETRACKER_FEED_URL  — volledige feed-URL (verplicht in CI, optioneel lokaal)
 *
 * Output:
 *   feed-parser/raw-feed.json
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_URL =
  'https://pf.tradetracker.net/?aid=509815&encoding=utf-8&type=json&fid=2315769&filter_html=1&filter_nl=1&categoryType=2&additionalType=2';

const feedUrl = process.env.TRADETRACKER_FEED_URL || DEFAULT_URL;
const outPath = join(__dirname, 'raw-feed.json');

async function fetchFeed() {
  console.log('⏳ Feed ophalen…');
  const res = await fetch(feedUrl);
  if (!res.ok) throw new Error(`Feed fetch mislukt: ${res.status} ${res.statusText}`);

  const data = await res.json();
  const products = data.products || data;
  console.log(`✅ ${products.length} producten ontvangen`);

  writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Opgeslagen: ${outPath}`);
}

fetchFeed().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
