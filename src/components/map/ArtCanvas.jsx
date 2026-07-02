import { useRef, useEffect, useCallback, useState } from 'react'
import { fetchOSMData } from '../../lib/osmFetcher.js'
import { renderArt } from '../../lib/artRenderer.js'

// pixels per degree longitude at a given conceptual zoom
function zoomToScale(zoom, dpr = 1) {
  return (256 * Math.pow(2, zoom) / 360) * dpr
}

export default function ArtCanvas({ center, zoom: initZoom = 13, preset, layerVisibility, onLoadStart, onLoadEnd }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const viewportRef = useRef({ centerLng: center[0], centerLat: center[1], zoom: initZoom })
  const osmDataRef = useRef(null)
  const isDragging = useRef(false)
  const lastPointer = useRef(null)
  const panMoved = useRef(false)
  const renderScheduled = useRef(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)

  // ── Canvas sizing ──────────────────────────────────────────────────────────
  function resizeCanvas() {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth
    const h = container.clientHeight
    if (canvas.width === w * dpr && canvas.height === h * dpr) return
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const scheduleRender = useCallback(() => {
    if (renderScheduled.current) return
    renderScheduled.current = true
    requestAnimationFrame(() => {
      renderScheduled.current = false
      const canvas = canvasRef.current
      const data = osmDataRef.current
      if (!canvas || !data || !preset) return
      const dpr = window.devicePixelRatio || 1
      const { centerLng, centerLat, zoom } = viewportRef.current
      renderArt(canvas, data, { centerLng, centerLat, scale: zoomToScale(zoom, dpr) }, preset, layerVisibility)
    })
  }, [preset, layerVisibility])

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAndRender = useCallback(async (lat, lng, zoom) => {
    setLoading(true)
    setVisible(false)
    setError(null)
    onLoadStart?.()
    try {
      const data = await fetchOSMData(lat, lng, zoom)
      osmDataRef.current = data
      scheduleRender()
      // Small delay so canvas paints before we reveal it
      setTimeout(() => setVisible(true), 40)
    } catch (err) {
      setError('Could not load map data — check your connection and try again.')
      console.error(err)
    } finally {
      setLoading(false)
      onLoadEnd?.()
    }
  }, [scheduleRender, onLoadStart, onLoadEnd])

  // ── Sync incoming center prop (new search result) ─────────────────────────
  useEffect(() => {
    viewportRef.current.centerLng = center[0]
    viewportRef.current.centerLat = center[1]
    fetchAndRender(center[1], center[0], viewportRef.current.zoom)
  }, [center[0], center[1]])

  // ── Re-render on style / visibility change (no fetch) ────────────────────
  useEffect(() => {
    scheduleRender()
  }, [preset, layerVisibility])

  // ── Setup canvas + resize observer ────────────────────────────────────────
  useEffect(() => {
    resizeCanvas()
    const ro = new ResizeObserver(() => {
      resizeCanvas()
      scheduleRender()
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // ── Pan ────────────────────────────────────────────────────────────────────
  function onPointerDown(e) {
    isDragging.current = true
    panMoved.current = false
    lastPointer.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!isDragging.current) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    if (Math.abs(dx) + Math.abs(dy) < 2) return
    panMoved.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }

    const dpr = window.devicePixelRatio || 1
    const { zoom, centerLat } = viewportRef.current
    const scale = zoomToScale(zoom, dpr)
    // dy in lat: inverse Mercator approximation (good for small pans)
    const latScale = scale / Math.cos((centerLat * Math.PI) / 180)
    viewportRef.current.centerLng -= (dx * dpr) / scale
    viewportRef.current.centerLat += (dy * dpr) / latScale
    scheduleRender()
  }

  function onPointerUp() {
    if (!isDragging.current) return
    isDragging.current = false
    if (panMoved.current) {
      const { centerLng, centerLat, zoom } = viewportRef.current
      fetchAndRender(centerLat, centerLng, zoom)
    }
  }

  // ── Zoom ───────────────────────────────────────────────────────────────────
  const zoomTimer = useRef(null)
  function onWheel(e) {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.4 : -0.4
    viewportRef.current.zoom = Math.max(10, Math.min(17, viewportRef.current.zoom + delta))
    scheduleRender()
    clearTimeout(zoomTimer.current)
    zoomTimer.current = setTimeout(() => {
      const { centerLng, centerLat, zoom } = viewportRef.current
      fetchAndRender(centerLat, centerLng, zoom)
    }, 600)
  }

  return (
    <div ref={containerRef} className="w-full h-full relative select-none" style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        className="block"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 h-6 rounded-full bg-current opacity-60 animate-pulse"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
          <p className="text-xs tracking-widest uppercase opacity-40">
            Fetching network…
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <p className="text-sm opacity-60 mb-2">Network unavailable</p>
            <p className="text-xs opacity-40">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
