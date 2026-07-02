// In dev: Vite proxies /api/osm → overpass-api.de (vite.config.js)
// In prod: Vercel function api/osm.js proxies the same request
const OSM_ENDPOINT = '/api/osm'

const cache = new Map()
const CACHE_TTL = 15 * 60 * 1000

function getBbox(centerLat, centerLng, zoom) {
  // Degrees of longitude radius to fetch — wider at lower zoom
  const radiusLng = 0.8 / Math.pow(2, zoom - 10)
  // Approximate latitude radius (Mercator compression near poles)
  const radiusLat = radiusLng * Math.cos((centerLat * Math.PI) / 180)
  return {
    south: centerLat - radiusLat,
    north: centerLat + radiusLat,
    west:  centerLng - radiusLng,
    east:  centerLng + radiusLng,
  }
}

function buildQuery(bbox, zoom) {
  const { south, west, north, east } = bbox
  const b = `${south.toFixed(5)},${west.toFixed(5)},${north.toFixed(5)},${east.toFixed(5)}`
  const buildings = zoom >= 14 ? `way["building"](${b});` : ''

  return `[out:json][timeout:30];
(
  way["highway"](${b});
  way["natural"="water"](${b});
  way["waterway"~"^(river|canal|stream)$"](${b});
  way["landuse"~"^(park|recreation_ground|forest|grass|meadow|village_green)$"](${b});
  way["leisure"~"^(park|garden|nature_reserve)$"](${b});
  way["natural"~"^(wood|scrub|grassland)$"](${b});
  way["railway"~"^(rail|light_rail|subway|tram)$"](${b});
  ${buildings}
);
(._;>;);
out body qt;`
}

export function parseOSMData(rawData) {
  if (!rawData?.elements?.length) return { roads: { motorway: [], trunk: [], primary: [], secondary: [], tertiary: [], residential: [], path: [] }, water: [], green: [], railways: [], buildings: [] }

  const nodes = new Map()
  for (const el of rawData.elements) {
    if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat])
  }

  const roads = { motorway: [], trunk: [], primary: [], secondary: [], tertiary: [], residential: [], path: [] }
  const water = [], green = [], railways = [], buildings = []

  for (const el of rawData.elements) {
    if (el.type !== 'way' || !el.nodes?.length) continue
    const coords = el.nodes.map((id) => nodes.get(id)).filter(Boolean)
    if (coords.length < 2) continue
    const t = el.tags || {}

    if (t.highway) {
      const h = t.highway
      if      (h === 'motorway' || h === 'motorway_link')                        roads.motorway.push(coords)
      else if (h === 'trunk'    || h === 'trunk_link')                           roads.trunk.push(coords)
      else if (h === 'primary'  || h === 'primary_link')                         roads.primary.push(coords)
      else if (h === 'secondary'|| h === 'secondary_link')                       roads.secondary.push(coords)
      else if (h === 'tertiary' || h === 'tertiary_link' || h === 'unclassified') roads.tertiary.push(coords)
      else if (h === 'residential' || h === 'living_street' || h === 'service')  roads.residential.push(coords)
      else if (h === 'footway'  || h === 'cycleway' || h === 'path' || h === 'pedestrian') roads.path.push(coords)
    } else if (t.natural === 'water' || t.waterway) {
      water.push(coords)
    } else if (t.landuse || t.leisure || t.natural === 'wood' || t.natural === 'scrub' || t.natural === 'grassland') {
      green.push(coords)
    } else if (t.railway) {
      railways.push(coords)
    } else if (t.building) {
      buildings.push(coords)
    }
  }

  return { roads, water, green, railways, buildings }
}

export async function fetchOSMData(centerLat, centerLng, zoom) {
  const roundedZoom = Math.round(zoom)
  const key = `${centerLat.toFixed(3)},${centerLng.toFixed(3)},${roundedZoom}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) return hit.data

  const bbox = getBbox(centerLat, centerLng, roundedZoom)
  const query = buildQuery(bbox, roundedZoom)

  const res = await fetch(OSM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) throw new Error(`OSM fetch failed: ${res.status}`)

  const json = await res.json()
  if (json.error) throw new Error(`Overpass error: ${json.error}`)

  const data = parseOSMData(json)
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
