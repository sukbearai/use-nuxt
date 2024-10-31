<script lang="ts" setup>
import { defaultAvatar, offLineIcon } from '~/constants/system'
import { QTClientSDK } from '~/services/qt'

const sdk = new QTClientSDK()

const { sendMessageToCpp } = useWebChannel()

const { userInfoList } = storeToRefs(useUserInfoListStore())

function onSignOut() {
  sendMessageToCpp(sdk.createSignOutDTO())
}

function onSignIn() {
  sendMessageToCpp(sdk.createSignInDTO())
}
</script>

<template>
  <div class="nav-bar">
    <el-card>
      <div class="nav-bar flex justify-between">
        <div class="nav-bar_right flex items-center">
          <div class="nav-bar_right_group ml-4 flex items-center text-[#4E5969] font-medium">
            <div>小组成员：</div>
            <div class="flex items-center space-x-[24px]">
              <div
                v-for="user in userInfoList"
                :key="user.name"
                class="flex items-center space-x-[10px]"
              >
                <div class="relative">
                  <a-avatar :size="32" :src="user.avatar || defaultAvatar" />
                  <div
                    v-if="user.state === '1'"
                    class="absolute left-0 top-0 z-[9] h-[32px] w-[32px] rounded-[16px] bg-[#000] opacity-50"
                  />
                  <a-image
                    v-if="user.state === '1'"
                    :preview="false"
                    :width="16"
                    :src="offLineIcon"
                    class="absolute bottom-[-13px] right-[13px] z-[10]"
                  />
                </div>
                <a-tooltip :title="user.name">
                  <div class="max-w-[56px] truncate">
                    {{ user.name }}
                  </div>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="flex space-x-[16px]">
          <div
            class="h-[32px] w-[76px] flex cursor-pointer items-center justify-center rounded-[16px] bg-[#6B6AFF] text-white"
            @click="onSignIn"
          >
            补签
          </div>
          <div
            class="h-[32px] w-[76px] flex cursor-pointer items-center justify-center rounded-[16px] bg-[#F53F3F] text-white"
            @click="onSignOut"
          >
            签退
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
