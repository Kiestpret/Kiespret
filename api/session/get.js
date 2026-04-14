// GET /api/session/get?id=xxxxx
// Haal sessie-data op — voor Partner B om de deck te laden
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Session ID is required' }), { status: 400 });
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

    return new Response(JSON.stringify({
      sessionId,
      deckParams: session.deckParams,
      status: session.status,
      partnerACount: session.partnerA.length,
      // Stuur alleen deck params naar Partner B, niet de likes van Partner A
      matches: session.matches || null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
