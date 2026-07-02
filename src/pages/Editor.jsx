import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import MapCanvas from '../components/map/MapCanvas.jsx'
import MapOverlay from '../components/map/MapOverlay.jsx'
import SearchBar from '../components/map/SearchBar.jsx'
import CustomizationPanel from '../components/editor/CustomizationPanel.jsx'
import ExportPanel from '../components/print/ExportPanel.jsx'
import { useMapStyle } from '../hooks/useMapStyle.js'
import { useExport } from '../hooks/useExport.js'

const DEFAULT_LOCATION = { lat: 41.8781, lng: -87.6298, shortName: 'Chicago' }

const SHAPE_CLIP = {
  rectangle: 'none',
  circle: 'circle(50% at 50% 50%)',
  hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
}

export default function Editor() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const mapRef = useRef(null)
  const overlayRef = useRef(null)

  const {
    activePreset,
    layerVisibility,
    layerColors,
    typography,
    format,
    shapeMask,
    applyPreset,
    toggleLayer,
    setLayerColor,
    updateTypography,
    updateFormat,
    setShapeMask,
  } = useMapStyle(mapRef)

  const { exportPNG, exporting, error: exportError } = useExport(mapRef, overlayRef)

  useEffect(() => {
    if (initialQuery) {
      updateTypography({ headline: initialQuery })
    }
  }, [])

  const handleMapReady = useCallback((map) => {
    mapRef.current = map
  }, [])

  function handleLocationSelect(result) {
    setLocation(result)
    updateTypography({
      headline: result.shortName,
      subheadline: `${result.lat.toFixed(4)}° N, ${Math.abs(result.lng).toFixed(4)}° ${result.lng < 0 ? 'W' : 'E'}`,
    })
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [result.lng, result.lat],
        zoom: 13,
        duration: 1400,
        essential: true,
      })
    }
  }

  const clipPath = SHAPE_CLIP[shapeMask] || 'none'

  return (
    <div className="h-screen w-screen flex bg-surface overflow-hidden">
      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="w-full h-full relative"
          style={{ clipPath: clipPath !== 'none' ? clipPath : undefined }}
        >
          <MapCanvas
            center={[location.lng, location.lat]}
            zoom={13}
            onMapReady={handleMapReady}
          />
          <MapOverlay ref={overlayRef} typography={typography} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-panel border-l border-border flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3 border-b border-border">
          <SearchBar initialQuery={initialQuery} onSelect={handleLocationSelect} />
        </div>

        {/* Customization panel */}
        <div className="flex-1 overflow-hidden">
          <CustomizationPanel
            activePreset={activePreset}
            layerVisibility={layerVisibility}
            layerColors={layerColors}
            typography={typography}
            format={format}
            shapeMask={shapeMask}
            onPresetSelect={applyPreset}
            onLayerToggle={toggleLayer}
            onLayerColorChange={setLayerColor}
            onTypographyChange={updateTypography}
            onFormatChange={updateFormat}
            onShapeChange={setShapeMask}
          />
        </div>

        {/* Export */}
        <ExportPanel
          onExportPNG={() => exportPNG(location.shortName)}
          onOrderPrint={() => navigate('/checkout')}
          exporting={exporting}
          exportError={exportError}
        />
      </div>
    </div>
  )
}
