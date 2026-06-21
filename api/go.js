/**
 * /api/go — Affiliate redirect endpoint
 *
 * Verbergt affiliate-URLs uit de publieke trips.js.
 * Bots die trips.js scrapen zien alleen /api/go?id=...&v=...
 * en kunnen de echte TradeTracker-URLs niet meer bulken.
 *
 * Query params:
 *   id  — trip ID (bijv. "corendon-flora-garden-beach")
 *   v   — variant index (0, 1, 2, …)
 *
 * Geeft 302-redirect naar de affiliate-URL.
 * Geeft 400/404 bij ontbrekende of ongeldige params.
 * Geeft 429 bij verdacht verkeer (rate limit per IP).
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Lees affiliate-map.json bij cold start (cached in geheugen per instance)
let affiliateMap = null;

function loadMap() {
  if (affiliateMap) return affiliateMap;
  try {
    const raw = readFileSync(join(process.cwd(), '.data', 'affiliate-map.json'), 'utf-8');
    affiliateMap = JSON.parse(raw);
    return affiliateMap;
  } catch (e) {
    console.error('affiliate-map.json niet gevonden of ongeldig:', e.message);
    return null;
  }
}

// Simpele in-memory rate limiter (per serverless instance)
const clickLog = new Map();
const RATE_WINDOW_MS = 10_000;  // 10 seconden
const MAX_CLICKS_PER_WINDOW = 5; // Max 5 clicks per 10s per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = clickLog.get(ip);

  if (!entry) {
    clickLog.set(ip, { count: 1, windowStart: now });
    return false;
  }

  // Window verlopen → reset
  if (now - entry.windowStart > RATE_WINDOW_MS) {
    clickLog.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  return entry.count > MAX_CLICKS_PER_WINDOW;
}

// Opschonen elke 60s (voorkomt geheugenlek bij langlopende instances)
setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW_MS * 2;
  for (const [ip, entry] of clickLog) {
    if (entry.windowStart < cutoff) clickLog.delete(ip);
  }
}, 60_000);

export default function handler(req, res) {
  // Alleen GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, v } = req.query;

  // Valideer parameters
  if (!id || v === undefined || v === '') {
    return res.status(400).json({ error: 'Missing id or v parameter' });
  }

  const variantIdx = parseInt(v, 10);
  if (isNaN(variantIdx) || variantIdx < 0 || variantIdx > 20) {
    return res.status(400).json({ error: 'Invalid variant index' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
           || req.headers['x-real-ip']
           || req.socket?.remoteAddress
           || 'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Probeer het even later.' });
  }

  // Lookup
  const map = loadMap();
  if (!map) {
    return res.status(500).json({ error: 'Affiliate data niet beschikbaar' });
  }

  const tripUrls = map[id];
  if (!tripUrls) {
    return res.status(404).json({ error: 'Trip niet gevonden' });
  }

  const url = tripUrls[variantIdx];
  if (!url) {
    return res.status(404).json({ error: 'Variant niet gevonden' });
  }

  // Valideer dat het een Corendon/TradeTracker URL is
  if (!url.startsWith('https://referral.corendon.nl/') && !url.startsWith('https://')) {
    return res.status(500).json({ error: 'Ongeldige redirect URL' });
  }

  // Cache headers: nooit cachen (elke klik moet gelogd worden door TradeTracker)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  // 302 redirect
  return res.redirect(302, url);
}
