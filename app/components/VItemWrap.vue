<script setup lang="ts">
defineProps({
  titleClass: {
    type: String,
  },
  bg: {
    type: String,
    default: () => 'lg',
  },
})
</script>

<template>
  <VBorderBox13 :bg="bg" :title-class="titleClass">
    <div class="h-full">
      <slot />
    </div>
  </VBorderBox13>
</template>

<style scoped lang="scss">
$item-title-height: 38px;
$item_title_content-height: calc(100% - 38px);

.item_title {
  height: $item-title-height;
  line-height: $item-title-height;
  width: 100%;
  color: #31abe3;
  text-align: center;
  // background: linear-gradient(to right, transparent, #0f0756, transparent);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .zuo,
  .you {
    width: 58px;
    height: 14px;
    background-image: url('/assets/v/zuo.png');
  }

  .you {
    transform: rotate(180deg);
  }
  .title-inner {
    font-weight: 900;
    letter-spacing: 2px;
    background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

:deep(.dv-border-box-content) {
  box-sizing: border-box;
  padding: 6px 16px 0px;
}
</style>
