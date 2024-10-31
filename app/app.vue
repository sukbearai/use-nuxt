<script setup lang="ts">
import { DataType, PAGE_SIGN, PAGE_SYNC } from './types/qt'
import { appName } from '~/constants'

const { connect, disconnect } = useWebChannel()

// 监听路由跳转
const cbId = connect((data) => {
  if (data.type === DataType.PAGE_JUMP) {
    if (data.screen === PAGE_SIGN.BIG_SCREEN) {
      if (data.index === PAGE_SYNC.LOGIN) {
        navigateTo('/v-screen')
      }
      else if (data.index === PAGE_SYNC.HOME) {
        navigateTo('/v-screen/data')
      }
    }
    else if (data.screen === PAGE_SIGN.SMALL_SCREEN) {
      if (data.index === PAGE_SYNC.LOGIN) {
        navigateTo('/s-screen')
      }
      else if (data.index === PAGE_SYNC.HOME) {
        navigateTo('/s-screen/task')
      }
    }
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})

useHead({
  title: appName,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

/* html.dark {
  color: white;
} */
</style>
