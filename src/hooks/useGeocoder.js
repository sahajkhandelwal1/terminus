import { useState, useCallback, useRef } from 'react'

export function useGeocoder() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const search = useCallback((query) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' },
        })
        const data = await res.json()
        setResults(
          data.map((item) => ({
            displayName: item.display_name,
            shortName: item.name || item.display_name.split(',')[0],
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            bbox: item.boundingbox
              ? [
                  parseFloat(item.boundingbox[2]),
                  parseFloat(item.boundingbox[0]),
                  parseFloat(item.boundingbox[3]),
                  parseFloat(item.boundingbox[1]),
                ]
              : null,
          }))
        )
      } catch (err) {
        setError('Search failed. Please try again.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }, [])

  return { results, loading, error, search, setResults }
}
