<script setup lang="ts">
import { appName } from '~/constants'

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
