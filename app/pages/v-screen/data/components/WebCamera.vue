<script setup lang="ts">
const props = defineProps({
  sequenceFrame: {
    type: String,
    required: true,
  },
})
const containerRef = ref<HTMLCanvasElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

watch(() => props.sequenceFrame, async (val) => {
  if (val) {
    await drawSequenceFrame(val, canvasRef.value!, 'cover')
  }
})

useResizeObserver(containerRef, async () => {
  await drawSequenceFrame(props.sequenceFrame, canvasRef.value!, 'cover')
})
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
    height: calc(100% - 20px);
  }
}
</style>
