import Toggle from '../ui/Toggle.jsx'
import ColorPicker from '../ui/ColorPicker.jsx'

const LAYERS = [
  { key: 'roads',     label: 'Roads',     colorKey: null },
  { key: 'highways',  label: 'Highways',  colorKey: null },
  { key: 'water',     label: 'Water',     colorKey: 'waterFill' },
  { key: 'parks',     label: 'Parks',     colorKey: 'greenFill' },
  { key: 'buildings', label: 'Buildings', colorKey: 'buildingFill' },
  { key: 'railways',  label: 'Railways',  colorKey: null },
]

export default function LayerControls({ visibility, colors, onToggle, onColorChange }) {
  return (
    <div>
      <p className="text-xs text-accent/50 uppercase tracking-widest mb-3">Layers</p>
      <div className="space-y-3">
        {LAYERS.map(({ key, label, colorKey }) => (
          <div key={key} className="flex items-center justify-between">
            <Toggle
              checked={visibility[key] !== false}
              onChange={() => onToggle(key)}
              label={label}
            />
            {colorKey && colors[colorKey] && (
              <ColorPicker
                value={colors[colorKey]}
                onChange={(color) => onColorChange(colorKey, color)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
