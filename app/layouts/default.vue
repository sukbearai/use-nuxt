<template>
  <main class="h-screen w-screen flex flex-col items-center">
    <div class="h-full w-full p-8 text-center">
      <el-card class="h-full">
        <slot />
      </el-card>
    </div>
  </main>
</template>

<style scoped>
:deep(.el-card__body) {
  height: 100%;
}
</style>
