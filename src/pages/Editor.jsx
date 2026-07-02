import { useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import MapCanvas from '../components/map/MapCanvas.jsx'
import MapOverlay from '../components/map/MapOverlay.jsx'
import SearchBar from '../components/map/SearchBar.jsx'

const DEFAULT_LOCATION = { lat: 41.8781, lng: -87.6298, shortName: 'Chicago' }

export default function Editor() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [zoom] = useState(13)
  const mapRef = useRef(null)

  const [typography] = useState({
    headline: initialQuery || 'Chicago',
    subheadline: '41.8781° N, 87.6298° W',
    font: 'Playfair Display',
    size: 32,
    weight: 400,
    letterSpacing: 0.06,
    color: '#ffffff',
    position: 'bottom',
  })

  const handleMapReady = useCallback((map) => {
    mapRef.current = map
  }, [])

  function handleLocationSelect(result) {
    setLocation(result)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [result.lng, result.lat],
        zoom: 13,
        duration: 1400,
        essential: true,
      })
    }
  }

  return (
    <div className="h-screen w-screen flex bg-surface overflow-hidden">
      {/* Map area */}
      <div className="flex-1 relative">
        <MapCanvas
          center={[location.lng, location.lat]}
          zoom={zoom}
          onMapReady={handleMapReady}
        />
        <MapOverlay typography={typography} />
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-panel border-l border-border flex flex-col shrink-0">
        {/* Search */}
        <div className="p-4 border-b border-border">
          <SearchBar initialQuery={initialQuery} onSelect={handleLocationSelect} />
        </div>

        {/* Placeholder panels */}
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs text-[var(--color-muted)] uppercase tracking-widest mb-4">
            Customization
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Style controls coming in Phase 3.
          </p>
        </div>

        {/* Export */}
        <div className="p-4 border-t border-border">
          <button className="w-full bg-accent text-surface py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Download Free PNG
          </button>
          <button className="w-full mt-2 border border-border text-accent/70 py-3 rounded-lg text-sm hover:border-accent/40 transition-colors">
            Order Print — from $29
          </button>
        </div>
      </div>
    </div>
  )
}
