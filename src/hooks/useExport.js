import { useState, useCallback } from 'react'
import { exportToPNG, downloadBlob } from '../lib/exportCanvas.js'

export function useExport(mapRef, overlayRef) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  const exportPNG = useCallback(async (locationName = 'map') => {
    if (!mapRef.current) return
    setExporting(true)
    setError(null)
    try {
      const blob = await exportToPNG(mapRef.current, overlayRef?.current)
      const filename = `terminus-${locationName.toLowerCase().replace(/\s+/g, '-')}.png`
      downloadBlob(blob, filename)
    } catch (err) {
      setError('Export failed. Please try again.')
      console.error(err)
    } finally {
      setExporting(false)
    }
  }, [mapRef, overlayRef])

  return { exportPNG, exporting, error }
}
