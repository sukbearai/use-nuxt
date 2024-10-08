<script lang="ts">
</script>

<script setup lang="ts">
import type { CountUpOptions } from 'countup.js'
import { CountUp } from 'countup.js'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    // 结束数值
    endVal: number | string
    // 开始数值
    startVal?: number | string
    // 动画时长，单位 s
    duration?: number | string
    // 是否自动计数
    autoplay?: boolean
    // 循环次数，有限次数 / 无限循环
    loop?: boolean | number | string
    // 延时，单位 s
    delay?: number
    // countup 配置项
    options?: CountUpOptions
  }>(),
  {
    startVal: 0,
    duration: 2.5,
    autoplay: true,
    loop: false,
    delay: 0,
    options: undefined,
  },
)

const emits = defineEmits<{
  // countup init complete
  (event: 'init', countup: CountUp): void
  // count complete
  (event: 'finished'): void
}>()

const elRef = ref<HTMLElement>()
const countUp = ref<CountUp>()

function initCountUp() {
  if (!elRef.value)
    return
  const startVal = Number(props.startVal)
  const endVal = Number(props.endVal)
  const duration = Number(props.duration)
  countUp.value = new CountUp(elRef.value, endVal, {
    startVal,
    duration,
    ...props.options,
  })
  if (countUp.value.error) {
    console.error(countUp.value.error)
    return
  }
  emits('init', countUp.value)
}

function startAnim(cb?: () => void) {
  countUp.value?.start(cb)
}

// endVal change & autoplay: true, restart animate
watch(
  () => props.endVal,
  (value) => {
    if (props.autoplay) {
      countUp.value?.update(value)
    }
  },
)

// loop animation
const finished = ref(false)
let loopCount = 0
function loopAnim() {
  loopCount++
  startAnim(() => {
    const isTruely = typeof props.loop === 'boolean' && props.loop
    if (isTruely || Number(props.loop) > loopCount) {
      delay(() => {
        countUp.value?.reset()
        loopAnim()
      }, props.delay)
    }
    else {
      finished.value = true
    }
  })
}
watch(finished, (flag) => {
  if (flag) {
    emits('finished')
  }
})

onMounted(() => {
  initCountUp()
  if (props.autoplay) {
    loopAnim()
  }
})
onUnmounted(() => {
  cancelAnimationFrame(dalayRafId)
  countUp.value?.reset()
})

let dalayRafId: number
// delay to execute callback function
function delay(cb: () => unknown, seconds = 1) {
  let startTime: number
  function count(timestamp: number) {
    if (!startTime)
      startTime = timestamp
    const diff = timestamp - startTime
    if (diff < seconds * 1000) {
      dalayRafId = requestAnimationFrame(count)
    }
    else {
      cb()
    }
  }
  dalayRafId = requestAnimationFrame(count)
}

function restart() {
  initCountUp()
  startAnim()
}

defineExpose({
  init: initCountUp,
  restart,
})
</script>

<template>
  <div class="countup-wrap">
    <slot name="prefix" />
    <span ref="elRef" />
    <slot name="suffix" />
  </div>
</template>
