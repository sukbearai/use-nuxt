<script setup lang="ts">
defineProps({
  name: {
    type: [String, Object],
    default: '',
  },
})
</script>

<template>
  <div class="popup-message">
    <div>🎉{{ name }}</div>
    <slot />
  </div>
</template>
