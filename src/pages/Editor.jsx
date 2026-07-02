import { useState, useRef, useEffect } from 'react'
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

  // If the home page passed explicit coords (from the dropdown selection), use them
  const paramLat  = parseFloat(searchParams.get('lat'))
  const paramLng  = parseFloat(searchParams.get('lng'))
  const paramName = searchParams.get('name') || initialQuery

  const [location, setLocation] = useState(
    !isNaN(paramLat) && !isNaN(paramLng)
      ? { lat: paramLat, lng: paramLng, shortName: paramName }
      : DEFAULT_LOCATION
  )
  const overlayRef = useRef(null)
  const posterRef = useRef(null)
  // mapRef used only by useExport for canvas capture
  const mapRef = useRef(null)

  const {
    activePreset,
    layerVisibility,
    resolvedPreset,
    typography,
    format,
    shapeMask,
    applyPreset,
    toggleLayer,
    setLayerColor,
    updateTypography,
    updateFormat,
    setShapeMask,
  } = useMapStyle()

  const { exportPNG, exporting, error: exportError } = useExport(mapRef, overlayRef)

  useEffect(() => {
    if (paramName) updateTypography({
      headline: paramName,
      subheadline: !isNaN(paramLat) && !isNaN(paramLng)
        ? `${paramLat.toFixed(4)}° N, ${Math.abs(paramLng).toFixed(4)}° ${paramLng < 0 ? 'W' : 'E'}`
        : '',
    })
  }, [])

  function handleLocationSelect(result) {
    setLocation(result)
    updateTypography({
      headline: result.shortName,
      subheadline: `${result.lat.toFixed(4)}° N, ${Math.abs(result.lng).toFixed(4)}° ${result.lng < 0 ? 'W' : 'E'}`,
    })
  }

  return (
    <div className="h-screen w-screen flex bg-surface overflow-hidden">
      {/* Studio / poster preview */}
      <div className="flex-1 relative overflow-hidden">
        <PosterPreview
          ref={posterRef}
          center={[location.lng, location.lat]}
          zoom={13}
          preset={resolvedPreset}
          layerVisibility={layerVisibility}
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
            layerColors={{
              background: resolvedPreset.background,
              water: resolvedPreset.waterFill,
              parks: resolvedPreset.greenFill,
              buildings: resolvedPreset.buildingFill,
            }}
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
