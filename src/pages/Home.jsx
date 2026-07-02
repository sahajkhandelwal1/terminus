import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/editor?q=${encodeURIComponent(query.trim())}`)
    }
  }

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

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any city or address…"
            autoFocus
            className="w-full bg-panel border border-border rounded-lg px-5 py-4 text-accent text-base placeholder-[var(--color-muted)] outline-none focus:border-accent/40 transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent text-surface text-sm font-medium rounded-md disabled:opacity-30 transition-opacity hover:opacity-90"
          >
            Create
          </button>
        </form>

        <p className="mt-6 text-xs text-[var(--color-muted)]">
          Free high-res download. No account required.
        </p>
      </motion.div>
    </div>
  )
}
