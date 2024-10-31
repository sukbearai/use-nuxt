<script setup lang="ts">
import FaceScan from './components/FaceScan.vue'

definePageMeta({
  layout: 'home',
})

const { sendMessageToCpp } = useWebChannel()
useHeartBeat('v', '0', sendMessageToCpp)
</script>

<template>
  <div class="index-box">
    <div class="content_center">
      <div class="h-full w-full px-8">
        <FaceScan />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  flex: 1;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}

.content_center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
