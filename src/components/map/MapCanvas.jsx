import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const DEFAULT_CENTER = [-87.6298, 41.8781] // Chicago
const DEFAULT_ZOOM = 12

// Free OSM tile style via MapTiler (no key needed for the demo raster style)
const MAPTILER_STYLE = 'https://api.maptiler.com/maps/streets/style.json?key=get_your_free_key_at_maptiler_com'

// Fallback to a public tile style that works without an API key
const FALLBACK_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
}

export default function MapCanvas({ center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM, onMapReady }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: FALLBACK_STYLE,
      center,
      zoom,
      attributionControl: false,
    })

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

    map.on('load', () => {
      mapRef.current = map
      if (onMapReady) onMapReady(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.flyTo({ center, zoom, duration: 1400, essential: true })
  }, [center, zoom])

  return <div ref={containerRef} className="w-full h-full" />
}
