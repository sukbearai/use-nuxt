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
      drawSequenceFrame(`/sequence-frame/${frameCount}.jpg`, canvasRef.value!)
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
