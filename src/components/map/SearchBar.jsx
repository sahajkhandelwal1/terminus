import { useState, useRef, useEffect } from 'react'
import { useGeocoder } from '../../hooks/useGeocoder.js'

export default function SearchBar({ onSelect, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const { results, loading, search, setResults } = useGeocoder()
  const inputRef = useRef(null)

  useEffect(() => {
    if (initialQuery) search(initialQuery)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    setActiveIdx(-1)
    search(val)
    setOpen(true)
  }

  function handleSelect(result) {
    setQuery(result.shortName)
    setResults([])
    setOpen(false)
    onSelect(result)
  }

  function handleKeyDown(e) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      handleSelect(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search a city or address…"
          className="w-full bg-[#111] border border-border rounded-lg px-4 py-2.5 text-sm text-accent placeholder-[var(--color-muted)] outline-none focus:border-accent/30 transition-colors pr-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-accent/30 border-t-accent/80 rounded-full animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-panel border border-border rounded-lg overflow-hidden z-50 shadow-xl">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i === activeIdx ? 'bg-accent/10 text-accent' : 'text-accent/70 hover:bg-accent/5'
              }`}
            >
              <span className="font-medium text-accent">{r.shortName}</span>
              <span className="text-[var(--color-muted)] ml-2 text-xs truncate">
                {r.displayName.split(',').slice(1, 3).join(',')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
