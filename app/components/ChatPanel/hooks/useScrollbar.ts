import type { ScrollbarProps } from '@arco-design/web-vue'
import { isBoolean } from '../utils/is'

export function useScrollbar(scrollbar: Ref<ScrollbarProps | boolean>) {
  const displayScrollbar = computed(() => Boolean(scrollbar.value))

  const scrollbarProps = computed(() => {
    if (!scrollbar.value)
      return undefined
    return {
      type: 'embed',
      ...(isBoolean(scrollbar.value) ? undefined : scrollbar.value),
    } as ScrollbarProps
  })

  return {
    displayScrollbar,
    scrollbarProps,
  }
}
