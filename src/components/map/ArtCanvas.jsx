import { useRef, useEffect, useCallback, useState } from 'react'
import { fetchOSMData } from '../../lib/osmFetcher.js'
import { renderArt } from '../../lib/artRenderer.js'

function zoomToScale(zoom, dpr = 1) {
  return (256 * Math.pow(2, zoom) / 360) * dpr
}

export default function ArtCanvas({ center, zoom: initZoom = 13, preset, layerVisibility }) {
  const canvasRef  = useRef(null)
  const containerRef = useRef(null)
  const viewportRef  = useRef({ centerLng: center[0], centerLat: center[1], zoom: initZoom })
  const osmDataRef   = useRef(null)
  const rafRef       = useRef(null)
  const isDragging   = useRef(false)
  const lastPointer  = useRef(null)
  const panMoved     = useRef(false)
  const zoomTimer    = useRef(null)

  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [ready,   setReady]   = useState(false)   // true once canvas has real dimensions

  // ── Sizing ─────────────────────────────────────────────────────────────────
  // Returns true if canvas now has valid dimensions, false if container is 0×0.
  function syncCanvasSize() {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return false
    const dpr = window.devicePixelRatio || 1
    const w = container.clientWidth
    const h = container.clientHeight
    if (w === 0 || h === 0) return false
    const needsResize = canvas.width !== w * dpr || canvas.height !== h * dpr
    if (needsResize) {
      canvas.width  = w * dpr
      canvas.height = h * dpr
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
    }
    return true
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const scheduleRender = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!syncCanvasSize()) return          // canvas not ready — bail
      const canvas = canvasRef.current
      const data   = osmDataRef.current
      if (!canvas || !data || !preset) return
      const dpr = window.devicePixelRatio || 1
      const { centerLng, centerLat, zoom } = viewportRef.current
      renderArt(
        canvas, data,
        { centerLng, centerLat, scale: zoomToScale(zoom, dpr) },
        preset, layerVisibility,
      )
    })
  }, [preset, layerVisibility])

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAndRender = useCallback(async (lat, lng, zoom) => {
    setLoading(true)
    setError(null)
    setReady(false)
    try {
      const data = await fetchOSMData(lat, lng, zoom)
      osmDataRef.current = data
      scheduleRender()
      // Show canvas once the RAF paint has likely completed
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    } catch (err) {
      console.error('[ArtCanvas] fetch failed:', err)
      setError(err.message || 'Could not load map data')
    } finally {
      setLoading(false)
    }
  }, [scheduleRender])

  // ── Sync center from parent (new search) ──────────────────────────────────
  useEffect(() => {
    viewportRef.current.centerLng = center[0]
    viewportRef.current.centerLat = center[1]
    fetchAndRender(center[1], center[0], viewportRef.current.zoom)
  }, [center[0], center[1]])

  // ── Re-render when preset/layers change (no fetch) ────────────────────────
  useEffect(() => { scheduleRender() }, [preset, layerVisibility])

  // ── ResizeObserver: resize canvas whenever the container changes ──────────
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (syncCanvasSize()) scheduleRender()
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [scheduleRender])

  // ── Pan ────────────────────────────────────────────────────────────────────
  function onPointerDown(e) {
    isDragging.current = true
    panMoved.current   = false
    lastPointer.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!isDragging.current) return
    const dx = e.clientX - lastPointer.current.x
    const dy = e.clientY - lastPointer.current.y
    if (Math.abs(dx) + Math.abs(dy) < 1) return
    panMoved.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }

    const dpr = window.devicePixelRatio || 1
    const { zoom, centerLat } = viewportRef.current
    const scale    = zoomToScale(zoom, dpr)
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
    <div
      ref={containerRef}
      className="w-full h-full relative select-none overflow-hidden"
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        className="block w-full h-full"
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="flex gap-1.5 items-end h-6">
            {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
              <div
                key={i}
                className="w-0.5 rounded-full bg-current animate-pulse"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 100}ms`, opacity: 0.4 }}
              />
            ))}
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-30">
            Fetching network
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <p className="text-xs opacity-50">Could not load map data</p>
            <p className="text-[10px] opacity-30 font-mono">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
