<script setup lang="ts">
import Navbar from './components/NavBar.vue'
import TaskPanel from './components/TaskPanel.vue'

// 心跳
const { sendMessageToCpp } = useWebChannel()
useHeartBeat('s', '1', sendMessageToCpp)
</script>

<template>
  <div class="page h-full flex flex-col p-4">
    <Navbar class="w-full" />
    <TaskPanel class="flex-1" />
  </div>
</template>
