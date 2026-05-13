/**
 * Vercel Serverless Proxy voor Microsoft Clarity Data Export API
 *
 * Voorkomt CORS-problemen door server-side te fetchen.
 * Token wordt gelezen uit Vercel environment variable CLARITY_API_TOKEN.
 *
 * Gebruik:  GET /api/clarity?numOfDays=3&dimension1=URL
 * Auth:    ?key=<DASHBOARD_SECRET> query-param (of Authorization header)
 */

export default async function handler(req, res) {
  // ── CORS preflight ──
  res.setHeader('Access-Control-Allow-Origin', 'https://www.kiespret.nl');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // ── Auth: simpele secret key check ──
  const secret = process.env.DASHBOARD_SECRET;
  const provided = req.query.key || (req.headers.authorization || '').replace('Bearer ', '');
  if (secret && provided !== secret) {
    return res.status(401).json({ error: 'Ongeldige toegangssleutel' });
  }

  // ── Clarity API token ──
  const clarityToken = process.env.CLARITY_API_TOKEN;
  if (!clarityToken) {
    return res.status(500).json({ error: 'CLARITY_API_TOKEN niet geconfigureerd in Vercel' });
  }

  // ── Forward naar Clarity ──
  const { numOfDays = '3', dimension1, dimension2, dimension3 } = req.query;
  const params = new URLSearchParams({ numOfDays });
  if (dimension1) params.set('dimension1', dimension1);
  if (dimension2) params.set('dimension2', dimension2);
  if (dimension3) params.set('dimension3', dimension3);

  try {
    const upstream = await fetch(
      `https://www.clarity.ms/export-data/api/v1/project-live-insights?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${clarityToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({
        error: `Clarity API ${upstream.status}`,
        detail: text
      });
    }

    const data = await upstream.json();

    // Cache 1 uur (data is max 3 dagen oud, verandert niet snel)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Clarity API niet bereikbaar', detail: err.message });
  }
}
