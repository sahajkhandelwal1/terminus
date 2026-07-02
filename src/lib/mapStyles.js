// Each preset defines a complete visual theme as a MapLibre style object.
// Uses the free OpenStreetMap raster fallback style from MapCanvas.
// When a vector tile source is wired in (Phase 3+), these will drive
// setPaintProperty calls on the live map instance instead.

export const PRESETS = {
  minimal: {
    name: 'Minimal',
    background: '#f5f0e8',
    water: '#c8d8e8',
    parks: '#d8e8c8',
    roads: '#e0d8c8',
    buildings: '#e8e0d0',
    text: '#555555',
    style: 'minimal',
  },
  noir: {
    name: 'Noir',
    background: '#1a1a1a',
    water: '#0d1a26',
    parks: '#1a2a1a',
    roads: '#2a2a2a',
    buildings: '#222222',
    text: '#888888',
    style: 'noir',
  },
  blueprint: {
    name: 'Blueprint',
    background: '#1a2a4a',
    water: '#0d1a3a',
    parks: '#1a3a2a',
    roads: '#2a4a7a',
    buildings: '#1a3a5a',
    text: '#7aa8d8',
    style: 'blueprint',
  },
  terrain: {
    name: 'Terrain',
    background: '#e8e0c8',
    water: '#b8d0e0',
    parks: '#c0d8a0',
    roads: '#d8c8a0',
    buildings: '#d0c090',
    text: '#5a4030',
    style: 'terrain',
  },
  neon: {
    name: 'Neon',
    background: '#080810',
    water: '#0a1530',
    parks: '#0a2010',
    roads: '#1a0a3a',
    buildings: '#100820',
    text: '#cc44ff',
    style: 'neon',
  },
  vintage: {
    name: 'Vintage',
    background: '#f0e8d0',
    water: '#c8b898',
    parks: '#c8d0a8',
    roads: '#d8c8a0',
    buildings: '#e0d0b0',
    text: '#6a5040',
    style: 'vintage',
  },
  monochrome: {
    name: 'Monochrome',
    background: '#ffffff',
    water: '#cccccc',
    parks: '#e0e0e0',
    roads: '#d0d0d0',
    buildings: '#e8e8e8',
    text: '#333333',
    style: 'monochrome',
  },
  custom: {
    name: 'Custom',
    background: '#0f0f1a',
    water: '#0a1525',
    parks: '#0a1a10',
    roads: '#1a1a2a',
    buildings: '#151520',
    text: '#aaaacc',
    style: 'custom',
  },
}

export const PRESET_KEYS = Object.keys(PRESETS)
