<script lang="ts" setup>
import { differenceInMilliseconds } from 'date-fns'

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
</script>

<template>
  <div class="nav-bar">
    <el-card>
      <div class="nav-bar flex justify-between">
        <div class="nav-bar_left flex items-center">
          <div class="text-lg font-bold">
            A Nuxt template for newbee
          </div>
          <div class="ml-4">
            距离本次实践结束还有：{{ countdown }}
          </div>
        </div>
        <div class="nav-bar_right flex items-center">
          <el-button type="primary">
            签退
          </el-button>
          <el-button type="primary">
            补签
          </el-button>
          <div class="nav-bar_right_group ml-4 flex items-center">
            <div>小组成员：</div>
            <user-info name="杨帆" :size="30" :show-label="false" />
            <user-info name="张三" :size="30" :show-label="false" />
            <user-info name="李四" :size="30" :show-label="false" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
