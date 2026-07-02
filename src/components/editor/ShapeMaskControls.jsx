const SHAPES = [
  { key: 'rectangle', label: 'Rect', clipPath: 'none' },
  { key: 'circle', label: 'Circle', clipPath: 'circle(50% at 50% 50%)' },
  { key: 'hexagon', label: 'Hex', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
]

export default function ShapeMaskControls({ shape, onChange }) {
  return (
    <div>
      <p className="text-xs text-accent/50 uppercase tracking-widest mb-3">Shape</p>
      <div className="flex gap-2">
        {SHAPES.map(({ key, label, clipPath }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 aspect-square rounded-md border-2 flex items-center justify-center transition-all ${
              shape === key ? 'border-accent' : 'border-border hover:border-accent/30'
            }`}
          >
            <div
              className="w-6 h-6 bg-accent/50"
              style={{ clipPath: clipPath === 'none' ? undefined : clipPath }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
