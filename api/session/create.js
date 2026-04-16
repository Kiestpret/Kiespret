// POST /api/session/create
// Partner A maakt een duo-sessie aan met gelikte trip IDs en deck parameters
export const config = { runtime: 'edge' };

// Whitelists — moeten matchen met waardes in app.html onboarding
const ALLOWED_SFEER = ['strand', 'rustig', 'zon', 'actief', 'natuur', 'avontuur', 'resort', 'comfort', 'allinclusive'];
// Let op: stap 3 in app.html slaat volledige maandnamen op (`data-maand="april"` etc.)
const ALLOWED_MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const ALLOWED_AIRPORTS = ['AMS', 'RTM', 'EIN', 'MST', 'GRQ'];
const ALLOWED_DUUR = [0, 7, 10, 14]; // 0 = maakt niet uit; stap 4 heeft alleen 7/10/14/0
const MAX_LIKED_IDS = 50;
const MAX_ID_LENGTH = 40;
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

function sanitizeDeckParams(raw) {
  if (!raw || typeof raw !== 'object') return {};

  const sfeer = Array.isArray(raw.sfeer)
    ? raw.sfeer.filter(s => typeof s === 'string' && ALLOWED_SFEER.includes(s)).slice(0, 10)
    : [];

  const maanden = Array.isArray(raw.maanden)
    ? raw.maanden.filter(m => typeof m === 'string' && ALLOWED_MAANDEN.includes(m)).slice(0, 7)
    : [];

  const budgetNum = Number(raw.budgetMax);
  const budgetMax = Number.isFinite(budgetNum) && budgetNum >= 0 && budgetNum <= 99999
    ? Math.round(budgetNum)
    : 9999;

  const duurNum = Number(raw.duur);
  const duur = ALLOWED_DUUR.includes(duurNum) ? duurNum : 0;

  const airport = typeof raw.airport === 'string' && ALLOWED_AIRPORTS.includes(raw.airport)
    ? raw.airport
    : 'AMS';

  return { sfeer, maanden, budgetMax, duur, airport };
}

function sanitizeLikedIds(raw) {
  if (!Array.isArray(raw)) return null;
  const clean = raw
    .filter(id => typeof id === 'string' && id.length > 0 && id.length <= MAX_ID_LENGTH && ID_PATTERN.test(id))
    .slice(0, MAX_LIKED_IDS);
  return clean.length > 0 ? clean : null;
}

function generateSessionId() {
  // 16 hex chars = 64 bits entropie → niet brute-forcebaar
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const url = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;

  if (!url || !token) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), { status: 500 });
  }

  try {
    const body = await req.json();
    const likedIds = sanitizeLikedIds(body.likedIds);

    if (!likedIds) {
      return new Response(JSON.stringify({ error: 'likedIds is required' }), { status: 400 });
    }

    const deckParams = sanitizeDeckParams(body.deckParams);

    const sessionId = generateSessionId();

    const sessionData = {
      partnerA: likedIds,
      deckParams,
      createdAt: Date.now(),
      status: 'waiting' // waiting | completed
    };

    // Upstash REST API: SET met EX via pipeline
    const setResponse = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['SET', `session:${sessionId}`, JSON.stringify(sessionData), 'EX', 604800]
      ])
    });

    if (!setResponse.ok) {
      const err = await setResponse.text();
      return new Response(JSON.stringify({ error: 'KV write failed', detail: err }), { status: 500 });
    }

    return new Response(JSON.stringify({ sessionId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
