<script setup lang="ts">
import { CameraId, DataType } from '~/types/qt'

const containerRef = ref<HTMLCanvasElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const { connect, disconnect } = useWebChannel()

const cbId = connect(async (data) => {
  if (data.type === DataType.VIDEO_FRAME && data.cam_id === CameraId.FACE) {
    await drawSequenceFrame(data.img!, canvasRef.value!, 'cover')

    if (data.line1 && data.line2 && data.line3) {
      ElMessage({
        dangerouslyUseHTMLString: true,
        type: 'info',
        duration: 5000,
        offset: 380,
        customClass: 'face-scan-message',
        message: `
           <div class="bg-[#00B894] rounded-[35px]">
             <div class="mb-1 text-white text-center text-[28px]">${data.line1}</div>
             <div class="mb-1 text-white text-center text-[28px]">${data.line2}</div>
             <div class="text-white text-center text-[28px]">${data.line3}</div>
           </div>
          `,
      })
    }
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})
</script>

<template>
  <div ref="containerRef" class="sequence-frame">
    <canvas ref="canvasRef" />
  </div>
</template>

<style>
.face-scan-message {
  background: var(--el-color-primary);
  border: none;
}

.face-scan-message .el-message__icon {
  display: none;
}
</style>

<style scoped lang="scss">
.sequence-frame {
  width: 100%;
  height: 100%;
  background: #e5e7eb;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
