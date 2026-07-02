export default function ColorPicker({ value, onChange }) {
  return (
    <div className="relative w-6 h-6 rounded-md overflow-hidden border border-border cursor-pointer">
      <div className="w-full h-full" style={{ background: value }} />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
    </div>
  )
}
