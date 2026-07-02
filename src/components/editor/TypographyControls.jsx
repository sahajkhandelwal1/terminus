import Slider from '../ui/Slider.jsx'
import ColorPicker from '../ui/ColorPicker.jsx'

const FONTS = [
  'Inter',
  'Playfair Display',
  'Space Mono',
  'DM Sans',
  'Cormorant Garamond',
  'Bebas Neue',
]

const POSITIONS = ['top', 'bottom', 'overlay']

export default function TypographyControls({ typography, onChange }) {
  const { headline, subheadline, font, size, weight, letterSpacing, color, position } = typography

  return (
    <div className="space-y-4">
      <p className="text-xs text-accent/50 uppercase tracking-widest">Text</p>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          placeholder="City name"
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-accent placeholder-[var(--color-muted)] outline-none focus:border-accent/30"
        />
      </div>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Subheadline</label>
        <input
          type="text"
          value={subheadline}
          onChange={(e) => onChange({ subheadline: e.target.value })}
          placeholder="Coordinates or custom text"
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-accent placeholder-[var(--color-muted)] outline-none focus:border-accent/30"
        />
      </div>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Font</label>
        <select
          value={font}
          onChange={(e) => onChange({ font: e.target.value })}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-accent outline-none focus:border-accent/30"
        >
          {FONTS.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <Slider
        label="Size"
        value={size}
        min={16}
        max={72}
        step={2}
        onChange={(v) => onChange({ size: v })}
      />

      <Slider
        label="Letter spacing"
        value={Math.round(letterSpacing * 100)}
        min={0}
        max={30}
        step={1}
        onChange={(v) => onChange({ letterSpacing: v / 100 })}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-accent/50">Color</span>
        <ColorPicker value={color} onChange={(c) => onChange({ color: c })} />
      </div>

      <div>
        <label className="text-xs text-accent/50 mb-1 block">Position</label>
        <div className="flex gap-1">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => onChange({ position: p })}
              className={`flex-1 py-1.5 rounded text-xs capitalize transition-colors ${
                position === p
                  ? 'bg-accent text-surface'
                  : 'border border-border text-accent/50 hover:border-accent/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
