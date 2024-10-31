<script setup lang="ts">
import { QTClientSDK } from '~/services/qt'
import { DataType, type UserInfo } from '~/types/qt'
import {
  defaultAvatar,
  scanImg,
  signStatus,
  signStatusBgColor,
  signStatusColor,
} from '~/constants/system'

const userInfoListStore = useUserInfoListStore()
const { isExistsCurrentUser, userInfoList } = storeToRefs(useUserInfoListStore())

const { sendMessageToCpp, connect, disconnect } = useWebChannel()

const sdk = new QTClientSDK()

const cbId = connect<UserInfo[]>((data) => {
  if (data.type === DataType.SIGN_IN) {
    userInfoListStore.setUserInfoList(data.payload!)
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})

useHeartBeat('s', '0', sendMessageToCpp)

function onNavigationTo() {
  sendMessageToCpp(sdk.createEnterStudyDTO())
  // navigateTo('/s-screen/task')
}
</script>

<template>
  <div
    v-if="!isExistsCurrentUser"
    class="h-full flex flex-col items-center justify-center pb-[60px]"
  >
    <a-image :preview="false" :width="235" :height="235" :src="scanImg" />
    <div class="mb-[24px] mt-[40px] text-[24px] text-[#1D2129] font-bold">
      人脸扫描
    </div>
    <div class="text-[16px] text-[#4E5969]">
      请对准<span class="text-[#6B6AFF]">摄像头扫描</span>人脸进行签到
    </div>
  </div>
  <div
    v-else
    class="h-full flex flex-col items-center justify-center pb-[60px] space-y-[48px]"
  >
    <div class="w-[790px] flex flex-wrap justify-center">
      <div
        v-for="user in userInfoList"
        :key="user.name"
        class="user-item mr-[80px] mt-[32px] w-[94px] flex flex-col items-center"
      >
        <a-avatar :size="94" :src="user.avatar || defaultAvatar" />
        <a-tooltip :title="user.name">
          <div
            class="mb-[4px] mt-[8px] max-w-[94px] truncate text-center text-[16px] text-[#1D2129] font-medium"
          >
            {{ user.name }}
          </div>
        </a-tooltip>
        <div
          class="h-[24px] w-[60px] flex items-center justify-center rounded-[12px] text-[12px]"
          :style="{
            backgroundColor: signStatusBgColor[user.state as unknown as keyof typeof signStatus],
            color: signStatusColor[user.state as unknown as keyof typeof signStatus],
          }"
        >
          {{ signStatus[user.state as unknown as keyof typeof signStatus] }}
        </div>
      </div>
    </div>
    <div
      class="h-[36px] w-[118px] flex cursor-pointer items-center justify-center rounded-[2px] bg-[#6B6AFF] text-white"
      @click="onNavigationTo"
    >
      进入学习
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-item:nth-child(5) {
  margin-right: 0px;
}

.user-item:nth-child(-n + 5) {
  margin-top: 0px;
}
</style>
