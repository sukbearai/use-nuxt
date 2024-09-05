<script setup lang="ts">
const settingStore = useSettingStore()
const { isScale } = storeToRefs(settingStore)

const wrapperStyle = {}
</script>

<template>
  <div class="page">
    <VScreenBox
      width="1920"
      height="1080"
      :delay="500"
      :full-screen="false"
      :box-style="{
        background: '#03050C',
        overflow: isScale ? 'hidden' : 'auto',
      }"
      :wrapper-style="wrapperStyle"
      :auto-scale="isScale"
    >
      <div class="content-wrap">
        <VHeader />
        <slot />
      </div>
    </VScreenBox>
    <VSetting />
  </div>
</template>

<style lang="scss" scoped>
.content-wrap {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 16px;
  box-sizing: border-box;
  background-image: url('/assets/v/pageBg.png');
  background-size: cover;
  background-position: center center;
}
</style>
