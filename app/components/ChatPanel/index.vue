<script lang="ts" setup>
import type { ScrollbarProps } from '@arco-design/web-vue'
import VirtualList from './components/VirtualList.vue'
import { useComponentRef } from './hooks/useComponentRef'
import { useScrollbar } from './hooks/useScrollbar'
import { isNumber } from './utils/is'

const props = defineProps({
  /**
   * @zh 列表数据，需要和 `item` 插槽同时使用
   * @en List data, need to be used with `item` slot at the same time
   */
  data: {
    type: Array as PropType<any[]>,
  },
  /**
   * @zh 是否为加载中状态
   * @en Whether it is loading state
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh 列表的最大高度
   * @en Maximum height of the list
   */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: 0,
  },
  /**
   * @zh 传递虚拟列表属性，传入此参数以开启虚拟滚动 [VirtualListProps](#VirtualListProps)
   * @en Pass virtual list properties, pass in this parameter to turn on virtual scrolling [VirtualListProps](#VirtualListProps)
   */
  virtualListProps: {
    type: Object as PropType<{ [key: string]: any }>,
  },
  /**
   * @zh 是否开启虚拟滚动条
   * @en Whether to enable virtual scroll bar
   * @version 2.38.0
   */
  scrollbar: {
    type: [Object, Boolean] as PropType<boolean | ScrollbarProps>,
    default: true,
  },
  /**
   * @zh 列表分页配置
   * @en List pagination configuration
   */
  pageNo: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits(['scroll', 'reachBottom', 'reachTop'])

const prefixCls = 'chat-list'

const { scrollbar } = toRefs(props)
const { componentRef, elementRef: listRef }
      = useComponentRef('containerRef')

const { scrollbarProps } = useScrollbar(scrollbar)
// 默认是在顶部,但是列表被自动滚动到底部了，所以正确的preScrollTop应该是虚拟列表 containerRef.value!.scrollHeight
// 不影响功能暂时不用修复
let preScrollTop = 0

const virtualListRef = ref()

function handleScroll(e: Event) {
  const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLElement
  const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight))

  if (scrollTop === 0) {
    // 修复滚动条位置
    emit('reachTop')
  }

  if (scrollTop > preScrollTop && bottom <= 0)
    emit('reachBottom')

  emit('scroll')
  preScrollTop = scrollTop
}

onMounted(() => {
  if (listRef.value) {
    const { scrollTop, scrollHeight, offsetHeight } = listRef.value
    if (scrollHeight <= scrollTop + offsetHeight)
      emit('reachBottom')
  }
})

function getCurrentPageItems(data: unknown[]) {
  // if (!props.paginationProps)
  //   return data

  // if (props.paginationProps && data.length > pageSize.value) {
  //   const startIndex = (current.value - 1) * pageSize.value
  //   return data.slice(startIndex, startIndex + pageSize.value)
  // }
  return data
}

const cls = computed(() => [
  prefixCls,
])

const contentStyle = computed(() => {
  if (props.maxHeight) {
    const maxHeight = isNumber(props.maxHeight)
      ? `${props.maxHeight}px`
      : props.maxHeight
    return { maxHeight, overflowY: 'auto' }
  }
  return undefined
})

const contentCls = computed(() => [
  `${prefixCls}`,
  [`${prefixCls}-virtual`],
])

// 优化Cumulative Layout Shift, CLS
// eslint-disable-next-line vue/return-in-computed-property
const emptyStyle = computed(() => {
  if (props.virtualListProps?.height) {
    return {
      height: `${props.virtualListProps.height}px`,
    }
  }
})

const wrapCls = computed(() => [
  `${prefixCls}-content-wrapper`,
  // 'bg-[#f5f5f5]',
])

// 修复异步数据不重渲染
const currentPageItems = computed(() => getCurrentPageItems(props.data ?? []))

defineExpose({ virtualListRef })
</script>

<template>
  <div :class="`${prefixCls}-wrapper`">
    <a-spin
      :class="`${prefixCls}-spin`"
      :loading="props.loading"
    >
      <a-scrollbar
        ref="componentRef"
        :class="cls"
        :style="contentStyle"
        v-bind="scrollbarProps"
        @scroll="handleScroll"
      >
        <div :class="wrapCls">
          <template v-if="$slots.header">
            <div :class="`${prefixCls}-header`">
              <slot name="header" />
            </div>
          </template>
          <!-- spin位置 -->
          <div :class="[`${prefixCls}-item`, `${prefixCls}-scroll-loading`]">
            <slot name="scroll-loading" />
          </div>
          <VirtualList
            v-if="currentPageItems.length"
            ref="virtualListRef"
            :class="contentCls"
            :data="currentPageItems"
            v-bind="virtualListProps"
            @scroll="handleScroll"
          >
            <slot name="no-more" />
            <template #item="{ item, index }">
              <slot name="item" :item="item" :index="index" />
            </template>
          </VirtualList>
          <template v-else>
            <div :style="emptyStyle">
              <a-empty />
            </div>
          </template>
          <template v-if="$slots.footer">
            <div :class="`${prefixCls}-footer`">
              <slot name="footer" />
            </div>
          </template>
        </div>
      </a-scrollbar>
    </a-spin>
  </div>
</template>

<style>
/* 修复 spin inline-block导致布局移动 */
.chat-list-spin {
  display: block;
}
</style>
