import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGeocoder } from '../hooks/useGeocoder.js'

export default function Home() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const { results, loading, search, setResults } = useGeocoder()
  const inputRef = useRef(null)
  const navigate = useNavigate()

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    setActiveIdx(-1)
    search(val)
    setOpen(true)
  }

  function handleSelect(result) {
    navigate(`/editor?q=${encodeURIComponent(result.displayName)}&lat=${result.lat}&lng=${result.lng}&name=${encodeURIComponent(result.shortName)}`)
  }

  function handleKeyDown(e) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0) handleSelect(results[activeIdx])
      else if (results.length > 0) handleSelect(results[0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showDropdown = open && (results.length > 0 || loading)

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl text-center"
      >
        <h1 className="text-5xl font-light tracking-tight text-accent mb-3">
          Terminus
        </h1>
        <p className="text-sm text-[var(--color-muted)] mb-10 tracking-widest uppercase">
          Type a place. Watch a poster build itself.
        </p>

        <div className="relative text-left">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => results.length > 0 && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Type any city or address…"
              autoFocus
              autoComplete="off"
              className="w-full bg-panel border border-border rounded-lg px-5 py-4 text-accent text-base placeholder-[var(--color-muted)] outline-none focus:border-accent/40 transition-colors pr-28"
            />

            {/* Spinner */}
            {loading && (
              <div className="absolute right-24 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-accent/20 border-t-accent/60 rounded-full animate-spin pointer-events-none" />
            )}

            <button
              type="button"
              onClick={() => results.length > 0 && handleSelect(results[activeIdx >= 0 ? activeIdx : 0])}
              disabled={results.length === 0 && !query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent text-surface text-sm font-medium rounded-md disabled:opacity-30 transition-opacity hover:opacity-90"
            >
              Create
            </button>
          </div>

          {/* Results dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full mt-2 w-full bg-panel border border-border rounded-xl overflow-hidden z-50 shadow-2xl"
              >
                {loading && results.length === 0 && (
                  <li className="px-5 py-3.5 text-sm text-[var(--color-muted)]">
                    Searching…
                  </li>
                )}
                {results.map((r, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSelect(r)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${
                      i === activeIdx ? 'bg-accent/8' : 'hover:bg-accent/5'
                    }`}
                  >
                    {/* Location pin */}
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
                    </svg>

                    <div className="min-w-0">
                      <p className="text-sm text-accent font-medium leading-snug">
                        {r.shortName}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate">
                        {r.displayName.split(',').slice(1).join(',').trim()}
                      </p>
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-xs text-[var(--color-muted)]">
          Free high-res download. No account required.
        </p>
      </motion.div>
    </div>
  )
}
