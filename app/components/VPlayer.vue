<script setup lang="ts">
import type { IPlayerOptions } from 'xgplayer'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const props = defineProps({
  config: {
    type: Object as () => IPlayerOptions,
    default: () => ({
      id: 'mse',
      url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4',
      height: '100%',
      width: '100%',
    }),
  },
})

const emit = defineEmits(['player'])

let player: Player | null = null

function init() {
  if (props.config.url) {
    player = new Player(props.config)
    emit('player', player)
  }
}

watch(() => props.config, () => {
  init()
}, { deep: true })

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  // eslint-disable-next-line ts/no-unused-expressions
  player && typeof player.destroy === 'function' && player.destroy()
})
</script>

<template>
  <div :id="props.config.id" />
</template>
