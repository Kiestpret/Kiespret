// POST /api/session/create
// Partner A maakt een duo-sessie aan met gelikte trip IDs en deck parameters
export const config = { runtime: 'edge' };

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
    const { likedIds, deckParams } = await req.json();

    if (!likedIds || !Array.isArray(likedIds) || likedIds.length === 0) {
      return new Response(JSON.stringify({ error: 'likedIds is required' }), { status: 400 });
    }

    // Genereer kort sessie-ID
    const sessionId = crypto.randomUUID().slice(0, 8);

    const sessionData = {
      partnerA: likedIds,
      deckParams: deckParams || {},
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
