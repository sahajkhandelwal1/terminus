import Toggle from '../ui/Toggle.jsx'
import ColorPicker from '../ui/ColorPicker.jsx'

const LAYERS = [
  { key: 'roads', label: 'Roads', colorKey: 'roads' },
  { key: 'water', label: 'Water', colorKey: 'water' },
  { key: 'parks', label: 'Parks', colorKey: 'parks' },
  { key: 'buildings', label: 'Buildings', colorKey: 'buildings' },
  { key: 'railways', label: 'Railways', colorKey: null },
  { key: 'labels', label: 'Labels', colorKey: 'text' },
]

export default function LayerControls({ visibility, colors, onToggle, onColorChange }) {
  return (
    <div>
      <p className="text-xs text-accent/50 uppercase tracking-widest mb-3">Layers</p>
      <div className="space-y-2.5">
        {LAYERS.map(({ key, label, colorKey }) => (
          <div key={key} className="flex items-center justify-between">
            <Toggle
              checked={visibility[key]}
              onChange={() => onToggle(key)}
              label={label}
            />
            {colorKey && (
              <ColorPicker
                value={colors[colorKey] || '#888888'}
                onChange={(color) => onColorChange(colorKey, color)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
