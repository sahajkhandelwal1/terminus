import html2canvas from 'html2canvas'

// Captures the MapLibre WebGL canvas and any HTML overlay into a single PNG Blob.
// MapLibre clears its WebGL buffer after each frame; we grab the pixel data
// synchronously inside the 'render' event so the buffer is still populated.
export async function exportToPNG(map, overlayEl) {
  return new Promise((resolve, reject) => {
    map.once('render', async () => {
      try {
        const mapCanvas = map.getCanvas()
        const width = mapCanvas.width
        const height = mapCanvas.height

        // Composite canvas
        const output = document.createElement('canvas')
        output.width = width
        output.height = height
        const ctx = output.getContext('2d')

        // 1. Draw map
        ctx.drawImage(mapCanvas, 0, 0)

        // 2. Draw HTML overlay (typography) if present
        if (overlayEl) {
          const overlayCanvas = await html2canvas(overlayEl, {
            backgroundColor: null,
            scale: window.devicePixelRatio || 1,
            width: overlayEl.offsetWidth,
            height: overlayEl.offsetHeight,
            useCORS: true,
          })
          ctx.drawImage(overlayCanvas, 0, 0, width, height)
        }

        output.toBlob((blob) => resolve(blob), 'image/png', 1.0)
      } catch (err) {
        reject(err)
      }
    })

    map.triggerRepaint()
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
