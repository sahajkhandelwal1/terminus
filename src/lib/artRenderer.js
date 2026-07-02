// Converts lng/lat → canvas device pixel coordinates via Web Mercator
function project(lng, lat, centerLng, centerLat, scale, w, h) {
  const x = (lng - centerLng) * scale + w / 2
  const latR = (lat * Math.PI) / 180
  const cLatR = (centerLat * Math.PI) / 180
  const y = -(Math.log(Math.tan(Math.PI / 4 + latR / 2)) - Math.log(Math.tan(Math.PI / 4 + cLatR / 2))) * scale + h / 2
  return [x, y]
}

function strokePaths(ctx, paths, centerLng, centerLat, scale, w, h) {
  for (const coords of paths) {
    if (!coords || coords.length < 2) continue
    ctx.beginPath()
    let first = true
    for (const [lng, lat] of coords) {
      const [px, py] = project(lng, lat, centerLng, centerLat, scale, w, h)
      if (first) { ctx.moveTo(px, py); first = false }
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
}

function fillPaths(ctx, paths, centerLng, centerLat, scale, w, h) {
  for (const coords of paths) {
    if (!coords || coords.length < 3) continue
    ctx.beginPath()
    let first = true
    for (const [lng, lat] of coords) {
      const [px, py] = project(lng, lat, centerLng, centerLat, scale, w, h)
      if (first) { ctx.moveTo(px, py); first = false }
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }
}

export function renderArt(canvas, osmData, viewport, preset, layerVisibility) {
  const { centerLng, centerLat, scale } = viewport
  const w = canvas.width
  const h = canvas.height
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  // Background
  ctx.fillStyle = preset.background
  ctx.fillRect(0, 0, w, h)

  // Green / parks
  if (layerVisibility.parks !== false) {
    ctx.fillStyle = preset.greenFill
    ctx.strokeStyle = 'transparent'
    fillPaths(ctx, osmData.green || [], centerLng, centerLat, scale, w, h)
  }

  // Water
  if (layerVisibility.water !== false) {
    ctx.fillStyle = preset.waterFill
    fillPaths(ctx, osmData.water || [], centerLng, centerLat, scale, w, h)
    // Water stroke (river edges)
    if (preset.waterStroke) {
      ctx.strokeStyle = preset.waterStroke
      ctx.lineWidth = 0.8 * dpr
      ctx.lineCap = 'round'
      strokePaths(ctx, osmData.water || [], centerLng, centerLat, scale, w, h)
    }
  }

  // Buildings
  if (layerVisibility.buildings !== false && osmData.buildings?.length) {
    ctx.fillStyle = preset.buildingFill
    fillPaths(ctx, osmData.buildings, centerLng, centerLat, scale, w, h)
    if (preset.buildingStroke) {
      ctx.strokeStyle = preset.buildingStroke
      ctx.lineWidth = 0.4 * dpr
      strokePaths(ctx, osmData.buildings, centerLng, centerLat, scale, w, h)
    }
  }

  // Railways
  if (layerVisibility.railways !== false && preset.railwayColor && osmData.railways?.length) {
    ctx.strokeStyle = preset.railwayColor
    ctx.lineWidth = 1.2 * dpr
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.setLineDash([4 * dpr, 4 * dpr])
    ctx.globalAlpha = 0.6
    strokePaths(ctx, osmData.railways, centerLng, centerLat, scale, w, h)
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }

  // Road layers — small to large for correct overlap
  const roadOrder = ['path', 'residential', 'tertiary', 'secondary', 'primary', 'trunk', 'motorway']
  const visFlags = { path: layerVisibility.roads, residential: layerVisibility.roads, tertiary: layerVisibility.roads, secondary: layerVisibility.roads, primary: layerVisibility.roads, trunk: layerVisibility.highways, motorway: layerVisibility.highways }

  for (const key of roadOrder) {
    if (visFlags[key] === false) continue
    const cfg = preset.roads?.[key]
    const paths = osmData.roads?.[key]
    if (!cfg || !paths?.length) continue

    ctx.globalAlpha = cfg.opacity ?? 1
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (cfg.glow) {
      // Draw glow pass first
      ctx.shadowBlur = cfg.glowSize * dpr
      ctx.shadowColor = cfg.glowColor || cfg.color
      ctx.strokeStyle = cfg.glowColor || cfg.color
      ctx.lineWidth = (cfg.width + cfg.glowSize * 0.4) * dpr
      strokePaths(ctx, paths, centerLng, centerLat, scale, w, h)
      ctx.shadowBlur = 0
    }

    // Main stroke
    ctx.strokeStyle = cfg.color
    ctx.lineWidth = cfg.width * dpr
    strokePaths(ctx, paths, centerLng, centerLat, scale, w, h)

    ctx.globalAlpha = 1
  }
}
