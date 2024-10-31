<script setup lang="ts">
import { differenceInMilliseconds } from 'date-fns'
import { DataType, PAGE_SIGN, PAGE_SYNC } from '~/types/qt'
import { appLogo } from '~/constants/system'

const settingStore = useSettingStore()
const { isScale } = storeToRefs(settingStore)

const wrapperStyle = {}

const { connect, disconnect } = useWebChannel()

const dialogFormVisible = ref(false)
const url = ref('')

const route = useRoute()

const countdown = ref('')
// const endTime = new Date(Date.now() + 30 * 60 * 1000)
const endTime = new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000)

function updateCountdown() {
  const diffInSeconds = differenceInMilliseconds(endTime, Date.now())
  countdown.value = diffInSeconds > 0 ? formatMilliseconds(diffInSeconds) : '00:00:00'
}

const intervalFn = useIntervalFn(updateCountdown, 1000)

onUnmounted(() => {
  intervalFn.pause()
})

const config = ref({
  id: 'mse',
  url: url.value || '',
  height: '450px',
  width: '100%',
  autoplayMuted: true,
  autoplay: true,
})

const cbId = connect((data) => {
  if (data.type === DataType.PAGE_JUMP) {
    if (data.screen === PAGE_SIGN.SMALL_SCREEN) {
      if (data.index === PAGE_SYNC.HOME && data.video_url) {
        // 进入学习页且视频弹窗播放
        url.value = data.video_url
        dialogFormVisible.value = true
      }
    }
  }
})

watch(
  url,
  (val) => {
    if (val)
      config.value.url = val
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(() => {
  disconnect(cbId)
})

const isShowCountDown = computed(() => {
  return route.path === '/s-screen/task'
})
</script>

<template>
  <div class="page">
    <VScreenBox
      :delay="500"
      :full-screen="true"
      :box-style="{
        background: '#fff',
        overflow: isScale ? 'hidden' : 'auto',
      }"
      :wrapper-style="wrapperStyle"
      :auto-scale="isScale"
    >
      <main class="h-full w-full flex flex-col items-center">
        <div
          class="h-[64px] w-full flex items-center bg-[#6B6AFF] px-[24px] text-[24px]"
        >
          <a-image :preview="false" :width="290" :src="appLogo" />
          <div v-if="isShowCountDown" class="ml-8 text-[1rem] text-white font-medium">
            距离本次实践结束还有：{{ countdown }}
          </div>
        </div>
        <div class="w-full flex-1">
          <slot />
        </div>
      </main>
    </VScreenBox>
    <el-dialog v-model="dialogFormVisible" title="项目介绍" width="900">
      <VPlayer :config="config" />
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="dialogFormVisible = false">
            关闭
          </el-button> -->
          <el-button type="primary" @click="dialogFormVisible = false">
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.el-card__body) {
  height: 100%;
}
</style>
