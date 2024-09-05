<script lang="ts" setup>
import { useSize } from '../hooks/useSize'
import { isNumber } from '../utils/is'
import type { ScrollOptions } from '../types'
import VirtualListItem from './VirtualListItem'

const props = defineProps({
  height: {
    type: [Number, String],
    default: 200,
  },
  data: {
    type: Array,
    default: () => [],
  },
  threshold: {
    type: Number,
    default: 0,
  },
  itemKey: {
    type: String,
    default: 'key',
  },
  fixedSize: {
    type: Boolean,
    default: false,
  },
  estimatedSize: {
    type: Number,
    default: 30,
  },
  buffer: {
    type: Number,
    default: 10,
  },
  component: {
    type: [String, Object],
    default: 'div',
  },
  listAttrs: {
    type: Object,
  },
  contentAttrs: {
    type: Object,
  },
  paddingPosition: {
    type: String,
    default: 'content',
  },
})

const emit = defineEmits(['scroll', 'reachBottom'])

const { data, itemKey, fixedSize, estimatedSize, buffer, height }
= toRefs(props)

const prefixCls = 'chat-list-virtual-list'

const containerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const style = computed(() => {
  return {
    height: isNumber(height.value) ? `${height.value}px` : height.value,
    overflow: 'auto',
  }
})

const dataKeys = computed(() =>
  data.value.map((item: any, index: any) => {
    return (item[itemKey.value] ?? index) as string | number
  }),
)

const {
  frontPadding,
  behindPadding,
  start,
  end,
  getStartByScroll,
  setItemSize,
  hasItemSize,
  setStart,
  getScrollOffset,
} = useSize({
  dataKeys,
  contentRef,
  fixedSize,
  estimatedSize,
  buffer,
})

const currentList = computed(() => {
  if (props.threshold && data.value.length <= props.threshold)
    return data.value

  return data.value.slice(start.value, end.value)
})

function scrollTo(options: ScrollOptions) {
  if (containerRef.value) {
    if (isNumber(options)) {
      containerRef.value.scrollTop = options
    }
    else {
      const _index
            = options.index ?? dataKeys.value.indexOf(options.key ?? '')
      setStart(_index - buffer.value)
      containerRef.value.scrollTop = getScrollOffset(_index)
      nextTick(() => {
        if (containerRef.value) {
          const _scrollTop = getScrollOffset(_index)
          if (_scrollTop !== containerRef.value.scrollTop)
            containerRef.value.scrollTop = _scrollTop
        }
      })
    }
  }
}

function onScroll(ev: Event) {
  const { scrollTop, scrollHeight, offsetHeight }
        = ev.target as HTMLElement
  const _start = getStartByScroll(scrollTop)
  if (_start !== start.value) {
    setStart(_start)
    nextTick(() => {
      scrollTo(scrollTop)
    })
  }
  emit('scroll', ev)
  const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight))
  if (bottom <= 0)
    emit('reachBottom', ev)
}

// 滚动到底部
function scrollToBottom() {
  if (containerRef.value) {
    nextTick(() => {
      // containerRef.value!.scrollTop = containerRef.value!.scrollHeight
      scrollTo({ index: data.value.length - 1 })
    })
  }
}

onMounted(scrollToBottom)

defineExpose({ containerRef, scrollToBottom, scrollTo })
</script>

<template>
  <div
    ref="containerRef"
    :class="prefixCls"
    :style="style"
    @scroll="onScroll"
  >
    <div
      v-bind="listAttrs" :style="
        paddingPosition === 'list'
          ? {
            paddingTop: `${frontPadding}px`,
            paddingBottom: `${behindPadding}px`,
          }
          : {}
      "
    >
      <div
        ref="contentRef"
        v-bind="contentAttrs"
        :style="
          paddingPosition === 'content'
            ? {
              paddingTop: `${frontPadding}px`,
              paddingBottom: `${behindPadding}px`,
            }
            : {}
        "
      >
        <slot />
        <VirtualListItem
          v-for="(item, index) of currentList"
          :key="item[itemKey] ?? start + index"
          :has-item-size="hasItemSize"
          :set-item-size="setItemSize"
        >
          <slot name="item" :item="item" :index="start + index" />
        </VirtualListItem>
      </div>
    </div>
  </div>
</template>
