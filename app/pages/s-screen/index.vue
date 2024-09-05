<script setup lang="ts">
const userInfoListStore = useUserInfoListStore()

function onNavigationTo() {
  navigateTo('/s-screen/task')
}
</script>

<template>
  <div class="page">
    <div class="text mt-8 text-xl font-bold">
      A Nuxt template for newbee
    </div>
    <div class="mt-36 text-lg">
      <template v-if="userInfoListStore.isExistsCurrentUser">
        请对准摄像头扫描人脸进行签到
      </template>
      <template v-else>
        <div class="w-full flex justify-center">
          <user-info name="杨帆" />
          <user-info name="张三" />
          <user-info name="李四" />
        </div>
        <el-button type="primary" class="mt-38" @click="onNavigationTo">
          进入学习
        </el-button>
      </template>
    </div>
  </div>
</template>
