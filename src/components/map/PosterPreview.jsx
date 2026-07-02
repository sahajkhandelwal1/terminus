import { forwardRef } from 'react'
import ArtCanvas from './ArtCanvas.jsx'
import MapOverlay from './MapOverlay.jsx'

const ASPECT_RATIOS = {
  'A3':     297 / 420,
  'A2':     420 / 594,
  'A1':     594 / 841,
  '18×24"': 18  / 24,
  '24×36"': 24  / 36,
  'Square': 1,
}

const BORDER_STYLES = {
  borderless:    { padding: 0,  lineWidth: 0 },
  'thin rule':   { padding: 28, lineWidth: 1 },
  'thick frame': { padding: 56, lineWidth: 0 },
}

const SHAPE_CLIP = {
  rectangle: undefined,
  circle:  'circle(50% at 50% 50%)',
  hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
}

const PosterPreview = forwardRef(function PosterPreview(
  { center, zoom, preset, layerVisibility, typography, format, shapeMask, overlayRef },
  posterRef
) {
  const { paperSize = 'A3', orientation = 'portrait', borderStyle = 'borderless' } = format || {}
  const baseRatio = ASPECT_RATIOS[paperSize] ?? (297 / 420)
  const aspectRatio = orientation === 'landscape' ? 1 / baseRatio : baseRatio
  const border = BORDER_STYLES[borderStyle] ?? BORDER_STYLES.borderless
  const clip = SHAPE_CLIP[shapeMask]
  const frameBackground = borderStyle === 'thick frame' ? '#f5f0e8' : 'transparent'

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ background: '#131313' }}
    >
      {/* Studio dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff14 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Poster paper */}
      <div
        ref={posterRef}
        className="relative"
        style={{
          aspectRatio: String(aspectRatio),
          maxHeight: '90%',
          maxWidth:  '90%',
          width:  aspectRatio >= 1 ? '90%' : undefined,
          height: aspectRatio <  1 ? '90%' : undefined,
          background: frameBackground,
          clipPath: clip,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 10px 30px rgba(0,0,0,0.5)',
          transition: 'aspect-ratio 0.4s ease, clip-path 0.35s ease',
        }}
      >
        {/* Mat / padding area */}
        <div className="absolute inset-0" style={{ padding: border.padding }}>
          <div className="relative w-full h-full overflow-hidden">

            {/* Thin rule inset border */}
            {border.lineWidth > 0 && (
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 ${border.lineWidth}px rgba(255,255,255,0.35)`,
                }}
              />
            )}

            {/* Artistic canvas */}
            <ArtCanvas
              center={center}
              zoom={zoom}
              preset={preset}
              layerVisibility={layerVisibility}
            />

            {/* Typography overlay */}
            <MapOverlay ref={overlayRef} typography={typography} />
          </div>
        </div>

        {/* Thick frame inner rule */}
        {borderStyle === 'thick frame' && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              inset: border.padding - 4,
              border: '1px solid rgba(0,0,0,0.12)',
            }}
          />
        )}
      </div>
    </div>
  )
})

export default PosterPreview
