const PAPER_SIZES = ['A3', 'A2', 'A1', '18×24"', '24×36"', 'Square']
const BORDERS = ['borderless', 'thin rule', 'thick frame']

export default function FormatControls({ format, onChange }) {
  const { paperSize, orientation, borderStyle } = format

  return (
    <div className="space-y-4">
      <p className="text-xs text-accent/50 uppercase tracking-widest">Format</p>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Paper size</label>
        <div className="grid grid-cols-3 gap-1">
          {PAPER_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ paperSize: size })}
              className={`py-1.5 rounded text-xs transition-colors ${
                paperSize === size
                  ? 'bg-accent text-surface'
                  : 'border border-border text-accent/50 hover:border-accent/30'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Orientation</label>
        <div className="flex gap-1">
          {['portrait', 'landscape'].map((o) => (
            <button
              key={o}
              onClick={() => onChange({ orientation: o })}
              className={`flex-1 py-1.5 rounded text-xs capitalize transition-colors ${
                orientation === o
                  ? 'bg-accent text-surface'
                  : 'border border-border text-accent/50 hover:border-accent/30'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Border</label>
        <div className="flex flex-col gap-1">
          {BORDERS.map((b) => (
            <button
              key={b}
              onClick={() => onChange({ borderStyle: b })}
              className={`py-1.5 rounded text-xs capitalize transition-colors ${
                borderStyle === b
                  ? 'bg-accent text-surface'
                  : 'border border-border text-accent/50 hover:border-accent/30'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
