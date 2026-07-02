import { useState, useCallback } from 'react'
import { PRESETS } from '../lib/mapStyles.js'

const DEFAULT_LAYERS = {
  roads: true,
  highways: true,
  water: true,
  parks: true,
  buildings: true,
  railways: true,
}

export function useMapStyle() {
  const [activePreset, setActivePreset] = useState('noir')
  const [layerVisibility, setLayerVisibility] = useState(DEFAULT_LAYERS)

  // Resolved preset: start from the named preset, allow per-layer color overrides
  const [colorOverrides, setColorOverrides] = useState({})

  const [typography, setTypography] = useState({
    headline: '',
    subheadline: '',
    font: 'Playfair Display',
    size: 32,
    weight: 400,
    letterSpacing: 0.06,
    color: '#ffffff',
    position: 'bottom',
  })
  const [format, setFormat] = useState({
    paperSize: 'A3',
    orientation: 'portrait',
    borderStyle: 'borderless',
  })
  const [shapeMask, setShapeMask] = useState('rectangle')

  // The resolved preset object passed to the renderer
  const resolvedPreset = {
    ...PRESETS[activePreset],
    ...colorOverrides,
  }

  const applyPreset = useCallback((key) => {
    if (!PRESETS[key]) return
    setActivePreset(key)
    setColorOverrides({})
  }, [])

  const toggleLayer = useCallback((layer) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  // Override a top-level color key (e.g. 'waterFill', 'background')
  const setLayerColor = useCallback((key, color) => {
    setColorOverrides((prev) => ({ ...prev, [key]: color }))
    setActivePreset('custom')
  }, [])

  const updateTypography = useCallback((updates) => {
    setTypography((prev) => ({ ...prev, ...updates }))
  }, [])

  const updateFormat = useCallback((updates) => {
    setFormat((prev) => ({ ...prev, ...updates }))
  }, [])

  return {
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
  }
}
