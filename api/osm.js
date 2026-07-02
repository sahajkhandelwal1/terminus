// Vercel edge function — proxies Overpass API requests.
// In dev, the Vite proxy handles /api/osm directly (see vite.config.js).
// Client sends application/x-www-form-urlencoded with data=<query>,
// which we forward unchanged to Overpass.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Vercel parses the body; we need to re-encode it for Overpass
  let query
  if (typeof req.body === 'string') {
    // Raw form-encoded string
    query = new URLSearchParams(req.body).get('data')
  } else if (req.body?.data) {
    query = req.body.data
  }

  if (!query) {
    res.status(400).json({ error: 'Missing Overpass query in request body' })
    return
  }

  try {
    const upstream = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '')
      res.status(upstream.status).json({ error: `Overpass returned ${upstream.status}`, detail: text.slice(0, 200) })
      return
    }

    const data = await upstream.json()
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate')
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
