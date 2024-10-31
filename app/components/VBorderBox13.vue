<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  color: {
    type: Array as unknown as PropType<[string, string]>,
    default: () => [],
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  bg: {
    type: String,
    default: 'lg',
  },
  titleClass: {
    type: String,
  },
})

const domRef = ref(null)
const { width, height } = useElementSize(domRef, { width: 0, height: 0 }, { box: 'border-box' })
</script>

<template>
  <div ref="domRef" class="dv-border-box-13 dv-border-box">
    <div class="dv-border-svg-container" :style="{ width: `${width}px`, height: `${height}px`, backgroundImage: `url('/assets/img/border-${bg}.png')` }" />
    <div v-if="titleClass" class="item_title" :class="{ 'mb-[18px]': bg !== 'mini' && bg !== 'env', [titleClass]: !!titleClass, 'ml-[14px]': bg !== 'mini' && bg !== 'env' }" />
    <div class="dv-border-box-content">
      <div class="h-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item_title {
  margin-top: 20px;
}

.dv-border-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.dv-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 10px;
}
.dv-border-box-content {
  position: relative;
  width: 100%;
  flex: 1;
}

.title-task {
  background-image: url('/assets/img/title-task.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 90px;
  height: 15px;
  position: relative;
  z-index: 1;
}

.title-camera-h {
  background-image: url('/assets/img/title-camera-h.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 160px;
  height: 15px;
  position: relative;
  z-index: 1;
}

.title-camera-v {
  background-image: url('/assets/img/title-camera-v.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 220px;
  height: 15px;
  position: relative;
  z-index: 1;
}

.title-evaluation {
  background-image: url('/assets/img/title-evaluation.png');
  background-size: contain;
  background-position: left top;
  background-repeat: no-repeat;
  width: 368px;
  height: 29px;
  position: relative;
  z-index: 1;
}

.title-env {
  background-image: url('/assets/img/title-env.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 110px;
  height: 25px;
  position: relative;
  z-index: 1;
  margin-left: 20px;
}

.title-camera-task {
  background-image: url('/assets/img/title-camera-task.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 140px;
  height: 15px;
  position: relative;
  z-index: 1;
}

.title-platform {
  background-image: url('/assets/img/title-platform.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 158px;
  height: 36px;
  position: relative;
  z-index: 1;
  margin-left: 0px !important;
}

.title-scene {
  background-image: url('/assets/img/title-scene.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: 158px;
  height: 36px;
  margin-left: 10px;
  position: relative;
  z-index: 1;
  margin-left: 0px !important;
}
</style>
