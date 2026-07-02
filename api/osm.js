// Vercel edge function — proxies Overpass API to avoid CORS + browser blocks.
// In dev, Vite proxy handles /api/osm directly (see vite.config.js).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { query } = req.body || {}
  if (!query) {
    res.status(400).json({ error: 'Missing query' })
    return
  }

  try {
    const upstream = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `Overpass returned ${upstream.status}` })
      return
    }

    const data = await upstream.json()
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate')
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
