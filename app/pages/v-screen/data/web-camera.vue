<script setup lang="ts">
const containerRef = ref<HTMLCanvasElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  loadSequenceFrame()
//  window.addEventListener("resize", drawSequenceFrameOnResize);
})

function loadSequenceFrame() {
  let frameCount = 1
  const totalFrames = 32
  const frameRate = 10 // 每秒10帧
  const frameDuration = 1000 / frameRate
  let lastFrameTime = 0

  function animate(timestamp: number) {
    if (!lastFrameTime)
      lastFrameTime = timestamp

    const elapsed = timestamp - lastFrameTime

    if (elapsed >= frameDuration) {
      drawSequenceFrame(`/sequence-frame/${frameCount}.jpg`)
      frameCount++
      lastFrameTime = timestamp - (elapsed % frameDuration)

      if (frameCount > totalFrames) {
        return
      }
    }

    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

function drawSequenceFrame(url: string) {
  const canvas = canvasRef.value
  if (!canvas) {
    console.error('Canvas element not found!')
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
  }
  img.src = url
}

// function drawSequenceFrameOnResize() {
//   if (imgArr.value.length > 0) {
//     drawKeyFrame(imgArr.value[0].src); // 当窗口大小变化时重新绘制图片
//   }
// }
</script>

<template>
  <div ref="containerRef" class="sequence-frame">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped lang="scss">
.sequence-frame {
  width: 100%;
  height: 100%;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
