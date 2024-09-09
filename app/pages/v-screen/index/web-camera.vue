<script setup lang="ts">
// import { h } from 'vue'
// import PopupMessage from './popup-message.vue'

const containerRef = ref<HTMLCanvasElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const { sendMessageToCpp } = useWebChannel({
  async onDataUpdated(data: any) {
    window.console.log('这是QT数据:', data)
    await drawSequenceFrame(data?.img, canvasRef.value!)
    sendMessageToCpp('这是JS数据')
  },
})

// const msgVNode = h(PopupMessage, { name: '👏👏👏' }, {
//   default: () => [
//     h('div', '签到成功'),
//   ],
// })

// onMounted(async () => {
//   loadSequenceFrame()
//   //  window.addEventListener("resize", drawSequenceFrameOnResize);
// })

// function loadSequenceFrame() {
//   let frameCount = 1
//   const totalFrames = 32
//   const frameRate = 10 // 每秒10帧
//   const frameDuration = 1000 / frameRate
//   let lastFrameTime = 0

//   function animate(timestamp: number) {
//     if (!lastFrameTime)
//       lastFrameTime = timestamp

//     const elapsed = timestamp - lastFrameTime

//     if (elapsed >= frameDuration) {
//       drawSequenceFrame(`/sequence-frame/${frameCount}.jpg`)
//       frameCount++
//       lastFrameTime = timestamp - (elapsed % frameDuration)

//       if (frameCount > totalFrames) {
//         ElMessage.success({
//           message: msgVNode,
//           duration: 5000,
//           offset: 800,
//         })

//         setTimeout(() => {
//           navigateTo('/v-screen/data')
//         }, 5000)
//         return
//       }
//     }

//     requestAnimationFrame(animate)
//   }

//   requestAnimationFrame(animate)
// }

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
