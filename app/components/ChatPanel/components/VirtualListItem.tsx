import type {
  ComponentPublicInstance,
} from 'vue'
import {
  cloneVNode,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'
import { getFirstComponent } from '../utils/vue-utils'

export default defineComponent({
  name: 'DcyVirtualListItem',
  props: {
    hasItemSize: {
      type: Function,
      required: true,
    },
    setItemSize: {
      type: Function,
      required: true,
    },
  },
  setup(props, { slots }) {
    const key = getCurrentInstance()?.vnode.key as string | number
    const itemRef = ref<HTMLElement | ComponentPublicInstance>()

    const setItemSize = () => {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      const ele = (itemRef.value?.$el ?? itemRef.value) as HTMLElement
      const height = ele?.getBoundingClientRect?.().height ?? ele?.offsetHeight
      if (height)
        props.setItemSize(key, height)
    }

    onMounted(() => setItemSize())
    onBeforeUnmount(() => setItemSize())

    return () => {
      const child = getFirstComponent(slots.default?.())
      if (child) {
        return cloneVNode(
          child,
          {
            ref: itemRef,
          },
          true,
        )
      }

      return null
    }
  },
})
