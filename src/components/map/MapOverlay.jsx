import { forwardRef } from 'react'

// Typography and border overlay composited on top of the MapLibre canvas.
// Exposed via forwardRef so the export hook can capture it with html2canvas.
const MapOverlay = forwardRef(function MapOverlay({ typography }, ref) {
  const { headline, subheadline, font, size, weight, letterSpacing, color, position } =
    typography || {}

  if (!headline && !subheadline) return null

  const positionClass =
    position === 'top'
      ? 'top-6 left-0 right-0 flex-col items-center'
      : position === 'bottom'
      ? 'bottom-6 left-0 right-0 flex-col items-center'
      : 'inset-0 flex-col items-center justify-center'

  return (
    <div
      ref={ref}
      className={`absolute flex pointer-events-none ${positionClass}`}
      style={{ fontFamily: font || 'Inter' }}
    >
      {headline && (
        <p
          className="text-center px-4 leading-tight"
          style={{
            fontSize: size ? `${size}px` : '2rem',
            fontWeight: weight || 400,
            letterSpacing: letterSpacing ? `${letterSpacing}em` : '0.05em',
            color: color || '#ffffff',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}
        >
          {headline}
        </p>
      )}
      {subheadline && (
        <p
          className="text-center px-4 mt-1 text-sm"
          style={{
            color: color || '#ffffff',
            opacity: 0.7,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            letterSpacing: '0.12em',
          }}
        >
          {subheadline}
        </p>
      )}
    </div>
  )
})

export default MapOverlay
