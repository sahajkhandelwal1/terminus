import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, /api/osm proxies directly to Overpass (bypasses CORS)
      '/api/osm': {
        target: 'https://overpass-api.de',
        changeOrigin: true,
        rewrite: () => '/api/interpreter',
      },
    },
  },
})
