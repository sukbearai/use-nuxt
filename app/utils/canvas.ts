type FitMode = 'contain' | 'cover'

export function drawSequenceFrame(url: string, canvas: HTMLCanvasElement, fitMode: FitMode = 'contain'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas element not found!'))
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Unable to get 2D context'))
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous' // To avoid CORS issues
    img.onload = () => {
      // Set canvas size
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // Calculate scaling and positioning
      const imgRatio = img.width / img.height
      const canvasRatio = canvas.width / canvas.height

      let drawWidth, drawHeight, drawX, drawY

      if (fitMode === 'contain') {
        if (imgRatio > canvasRatio) {
          // Image is wider than canvas (relative to their heights)
          drawWidth = canvas.width
          drawHeight = drawWidth / imgRatio
          drawX = 0
          drawY = (canvas.height - drawHeight) / 2
        }
        else {
          // Image is taller than canvas (relative to their widths)
          drawHeight = canvas.height
          drawWidth = drawHeight * imgRatio
          drawY = 0
          drawX = (canvas.width - drawWidth) / 2
        }
      }
      else { // cover
        if (imgRatio > canvasRatio) {
          // Image is wider than canvas (relative to their heights)
          drawHeight = canvas.height
          drawWidth = drawHeight * imgRatio
          drawY = 0
          drawX = (canvas.width - drawWidth) / 2
        }
        else {
          // Image is taller than canvas (relative to their widths)
          drawWidth = canvas.width
          drawHeight = drawWidth / imgRatio
          drawX = 0
          drawY = (canvas.height - drawHeight) / 2
        }
      }

      // Clear previous content
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw image
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

      resolve()
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}
