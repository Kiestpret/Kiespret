// GET /api/session/get?id=xxxxx
// Haal sessie-data op — voor Partner B om de deck te laden
export const config = { runtime: 'edge' };

// Accepteert zowel oude 8-char sessies als nieuwe 16-char sessies
const SESSION_ID_PATTERN = /^[a-f0-9]{8,32}$/;

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('id');

  if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) {
    return new Response(JSON.stringify({ error: 'Invalid session ID' }), { status: 400 });
  }

  const url = process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN;

  if (!url || !token) {
    return new Response(JSON.stringify({ error: 'KV not configured' }), { status: 500 });
  }

  try {
    const response = await fetch(`${url}/get/session:${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'KV read failed' }), { status: 500 });
    }

    const data = await response.json();

    if (!data.result) {
      return new Response(JSON.stringify({ error: 'Session not found or expired' }), { status: 404 });
    }

    const session = JSON.parse(data.result);

    // Geef Partner A's likedIds niet terug vóór completion (voorkomt info-leak)
    const body = {
      sessionId,
      deckParams: session.deckParams,
      status: session.status
    };
    if (session.status === 'completed') {
      body.matches = session.matches || [];
      body.overlapType = session.overlapType || null;
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
