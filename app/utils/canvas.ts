export function drawSequenceFrame(url: string, canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas element not found!'))
      return
    }

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const img = new Image()
    img.onload = () => {
      // 设置canvas尺寸
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // 图片比例和canvas比例
      const imgRatio = img.width / img.height
      const canvasRatio = canvas.width / canvas.height

      let drawWidth, drawHeight, drawX, drawY

      // 根据比例确定绘制尺寸和位置
      if (imgRatio > canvasRatio) {
        drawWidth = canvas.width
        drawHeight = canvas.width / imgRatio
        drawX = 0
        drawY = (canvas.height - drawHeight) / 2
      }
      else {
        drawWidth = canvas.height * imgRatio
        drawHeight = canvas.height
        drawX = (canvas.width - drawWidth) / 2
        drawY = 0
      }

      // 清除之前的内容
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制图片
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight - 15)

      resolve()
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}
