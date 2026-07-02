import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import PosterPreview from '../components/map/PosterPreview.jsx'
import SearchBar from '../components/map/SearchBar.jsx'
import CustomizationPanel from '../components/editor/CustomizationPanel.jsx'
import ExportPanel from '../components/print/ExportPanel.jsx'
import { useMapStyle } from '../hooks/useMapStyle.js'
import { useExport } from '../hooks/useExport.js'

const DEFAULT_LOCATION = { lat: 41.8781, lng: -87.6298, shortName: 'Chicago' }

export default function Editor() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const mapRef = useRef(null)
  const overlayRef = useRef(null)
  const posterRef = useRef(null)

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

  return (
    <div className="h-screen w-screen flex bg-surface overflow-hidden">
      {/* Studio / poster preview area */}
      <div className="flex-1 relative overflow-hidden">
        <PosterPreview
          ref={posterRef}
          center={[location.lng, location.lat]}
          zoom={13}
          onMapReady={handleMapReady}
          typography={typography}
          format={format}
          shapeMask={shapeMask}
          overlayRef={overlayRef}
        />
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-panel border-l border-border flex flex-col shrink-0">
        <div className="p-3 border-b border-border">
          <SearchBar initialQuery={initialQuery} onSelect={handleLocationSelect} />
        </div>

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
