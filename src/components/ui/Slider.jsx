export default function Slider({ value, onChange, min = 0, max = 100, step = 1, label }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-accent/50">{label}</span>
          <span className="text-xs text-accent/70">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-accent"
      />
    </div>
  )
}
