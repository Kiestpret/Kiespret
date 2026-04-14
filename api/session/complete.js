// POST /api/session/complete
// Partner B stuurt gelikte IDs — overlap wordt berekend
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
    const { sessionId, likedIds } = await req.json();

    if (!sessionId || !likedIds || !Array.isArray(likedIds)) {
      return new Response(JSON.stringify({ error: 'sessionId and likedIds are required' }), { status: 400 });
    }

    // Haal sessie op
    const getResponse = await fetch(`${url}/get/session:${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!getResponse.ok) {
      return new Response(JSON.stringify({ error: 'KV read failed' }), { status: 500 });
    }

    const getData = await getResponse.json();

    if (!getData.result) {
      return new Response(JSON.stringify({ error: 'Session not found or expired' }), { status: 404 });
    }

    const session = JSON.parse(getData.result);

    // Bereken overlap
    const matches = session.partnerA.filter(id => likedIds.includes(id));

    // Bepaal overlap-type conform bouwplan
    let overlapType;
    if (matches.length >= 2) {
      overlapType = 'perfect'; // Perfecte match
    } else if (matches.length === 1) {
      overlapType = 'bijna'; // Bijna match
    } else {
      overlapType = 'geen'; // Geen overlap
    }

    // Update sessie
    const updatedSession = {
      ...session,
      partnerB: likedIds,
      matches,
      overlapType,
      status: 'completed',
      completedAt: Date.now()
    };

    // Sla op met vernieuwde TTL
    const setResponse = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['SET', `session:${sessionId}`, JSON.stringify(updatedSession), 'EX', 604800]
      ])
    });

    if (!setResponse.ok) {
      return new Response(JSON.stringify({ error: 'KV write failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({
      matches,
      overlapType,
      partnerALiked: session.partnerA.length,
      partnerBLiked: likedIds.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
