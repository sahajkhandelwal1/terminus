export default function Button({ children, onClick, variant = 'primary', className = '', disabled }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-30'
  const variants = {
    primary: 'bg-accent text-surface hover:opacity-90',
    secondary: 'border border-border text-accent/70 hover:border-accent/40',
    ghost: 'text-accent/60 hover:text-accent',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
