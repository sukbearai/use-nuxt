<script lang="ts" setup>
const props = defineProps({
  width: {
    type: Number,
    default: () => 90,
  },
  height: {
    type: Number,
    default: () => 90,
  },
  text: {
    type: String,
  },
  percent: {
    type: Number,
    default: () => 50,
  },
})

// 获取圆周长
const circumference = 2 * Math.PI * 70

// 根据百分比计算 offset
const offset = computed(() => {
  return circumference - (props.percent / 100 * circumference)
})

// 根据百分比设置颜色
const strokeColor = computed(() => {
  return props.percent > 85 ? '#FF0000' : '#0184DF' // 红色或蓝色
})
</script>

<template>
  <svg :width="props.width" :height="props.height" viewBox="0 0 200 200">
    <!-- 背景圆环 -->
    <circle cx="100" cy="100" r="94" stroke="#032978" stroke-width="6" fill="none" />
    <circle cx="100" cy="100" r="79" stroke="#e6e6e6" stroke-width="0" fill="#021C57" />
    <circle cx="100" cy="100" r="46" stroke="#e6e6e6" stroke-width="0" fill="#032978" />

    <text x="56" y="110" font-size="14" fill="#fff">{{ props.text }}</text>

    <!-- 前景圆环，显示进度 -->
    <circle
      id="progressCircle"
      cx="100"
      cy="100"
      r="70"
      :stroke="strokeColor"
      stroke-width="20"
      fill="none"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      class="progress-circle"
    />
  </svg>
</template>

<style scoped>
.progress-circle {
  transition:
    stroke-dashoffset 1s ease,
    stroke 1s ease; /* 添加颜色过渡 */
}
</style>
