import { useState, useCallback } from 'react'
import { PRESETS } from '../lib/mapStyles.js'

const DEFAULT_LAYERS = {
  roads: true,
  highways: true,
  water: true,
  parks: true,
  buildings: true,
  railways: true,
  labels: true,
}

export function useMapStyle(mapRef) {
  const [activePreset, setActivePreset] = useState('noir')
  const [layerVisibility, setLayerVisibility] = useState(DEFAULT_LAYERS)
  const [layerColors, setLayerColors] = useState({
    roads: PRESETS.noir.roads,
    water: PRESETS.noir.water,
    parks: PRESETS.noir.parks,
    buildings: PRESETS.noir.buildings,
    text: PRESETS.noir.text,
    background: PRESETS.noir.background,
  })
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

  const applyPreset = useCallback((presetKey) => {
    const preset = PRESETS[presetKey]
    if (!preset) return
    setActivePreset(presetKey)
    setLayerColors({
      roads: preset.roads,
      water: preset.water,
      parks: preset.parks,
      buildings: preset.buildings,
      text: preset.text,
      background: preset.background,
    })
  }, [])

  const toggleLayer = useCallback((layer) => {
    setLayerVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  const setLayerColor = useCallback((layer, color) => {
    setLayerColors((prev) => ({ ...prev, [layer]: color }))
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
  }
}
