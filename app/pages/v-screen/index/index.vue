<script setup lang="ts">
import WebCamera from './web-camera.vue'

definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div class="index-box">
    <div class="content_center">
      <VItemWrap class="content_center_camera" title="人脸识别">
        <WebCamera />
      </VItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}

.content_center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .content_center_camera {
    height: 80vh;
  }
}
</style>
