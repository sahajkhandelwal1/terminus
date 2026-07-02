import { PRESETS, PRESET_KEYS } from '../../lib/mapStyles.js'

export default function StylePresets({ activePreset, onSelect }) {
  return (
    <div>
      <p className="text-xs text-accent/50 uppercase tracking-widest mb-3">Style</p>
      <div className="grid grid-cols-4 gap-2">
        {PRESET_KEYS.map((key) => {
          const preset = PRESETS[key]
          const isActive = activePreset === key
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              title={preset.name}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                isActive ? 'border-accent' : 'border-transparent hover:border-accent/30'
              }`}
              style={{ background: preset.background }}
            >
              <div className="w-full h-full flex flex-col justify-end p-1">
                <div
                  className="h-0.5 w-full rounded mb-0.5 opacity-60"
                  style={{ background: preset.roads }}
                />
                <div
                  className="h-0.5 w-3/4 rounded opacity-40"
                  style={{ background: preset.roads }}
                />
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-1 grid grid-cols-4 gap-2">
        {PRESET_KEYS.map((key) => (
          <p key={key} className="text-center text-[9px] text-accent/40 truncate">
            {PRESETS[key].name}
          </p>
        ))}
      </div>
    </div>
  )
}
