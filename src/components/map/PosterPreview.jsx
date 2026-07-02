import { forwardRef } from 'react'
import MapCanvas from './MapCanvas.jsx'
import MapOverlay from './MapOverlay.jsx'

// Portrait aspect ratios for each paper size
const ASPECT_RATIOS = {
  'A3':    297 / 420,
  'A2':    420 / 594,
  'A1':    594 / 841,
  '18×24"': 18 / 24,
  '24×36"': 24 / 36,
  'Square': 1,
}

const BORDER_STYLES = {
  borderless: { padding: 0, lineWidth: 0 },
  'thin rule': { padding: 28, lineWidth: 1 },
  'thick frame': { padding: 56, lineWidth: 0 },
}

const SHAPE_CLIP = {
  rectangle: undefined,
  circle: 'circle(50% at 50% 50%)',
  hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
}

const PosterPreview = forwardRef(function PosterPreview(
  { center, zoom, onMapReady, typography, format, shapeMask, overlayRef },
  posterRef
) {
  const { paperSize = 'A3', orientation = 'portrait', borderStyle = 'borderless' } = format || {}

  const baseRatio = ASPECT_RATIOS[paperSize] ?? (297 / 420)
  const aspectRatio = orientation === 'landscape' ? 1 / baseRatio : baseRatio

  const border = BORDER_STYLES[borderStyle] ?? BORDER_STYLES.borderless
  const clip = SHAPE_CLIP[shapeMask]

  // For thick frame, use an off-white mat color
  const matColor = typography?.color
    ? `${typography.color}18`
    : '#f5f0e815'
  const frameBackground = borderStyle === 'thick frame' ? '#f5f0e8' : 'transparent'

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#141414' }}
    >
      {/* Studio hint — subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Poster paper */}
      <div
        ref={posterRef}
        className="relative shadow-2xl"
        style={{
          aspectRatio: `${aspectRatio}`,
          maxHeight: '88%',
          maxWidth: '88%',
          width: aspectRatio >= 1 ? '88%' : undefined,
          height: aspectRatio < 1 ? '88%' : undefined,
          background: frameBackground,
          clipPath: clip,
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)',
          transition: 'aspect-ratio 0.4s ease, clip-path 0.3s ease',
        }}
      >
        {/* Mat padding area (thick frame only) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            padding: border.padding,
          }}
        >
          {/* Inner map container */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Thin rule border */}
            {border.lineWidth > 0 && (
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  outline: `${border.lineWidth}px solid rgba(255,255,255,0.4)`,
                  outlineOffset: `-${border.lineWidth}px`,
                }}
              />
            )}

            <MapCanvas center={center} zoom={zoom} onMapReady={onMapReady} />
            <MapOverlay ref={overlayRef} typography={typography} />
          </div>
        </div>

        {/* Thick frame inner rule */}
        {borderStyle === 'thick frame' && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              inset: border.padding - 4,
              border: '1px solid rgba(0,0,0,0.15)',
            }}
          />
        )}
      </div>
    </div>
  )
})

export default PosterPreview
