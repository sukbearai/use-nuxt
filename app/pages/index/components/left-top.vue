<script setup lang="ts">
import { countDeviceNum } from '~/services/v'

const duration = ref(2)
const state = reactive({
  alarmNum: 0,
  offlineNum: 0,
  onlineNum: 0,
  totalNum: 0,
})

function getData() {
  countDeviceNum().then((res) => {
    if (res.data.success) {
      state.alarmNum = res.data.data.alarmNum
      state.offlineNum = res.data.data.offlineNum
      state.onlineNum = res.data.data.onlineNum
      state.totalNum = res.data.data.totalNum
    }
    else {
      ElMessage.error(res.data.msg)
    }
  }).catch((err) => {
    ElMessage.error(err)
  })
}
getData()
</script>

<template>
  <ul class="user_Overview flex">
    <li class="user_Overview-item" style="color: #00fdfa">
      <div class="user_Overview_nums allnum">
        <VCountUp :end-val="state.totalNum" :duration="duration" />
      </div>
      <p>总设备数</p>
    </li>
    <li class="user_Overview-item" style="color: #07f7a8">
      <div class="user_Overview_nums online">
        <VCountUp :end-val="state.onlineNum" :duration="duration" />
      </div>
      <p>在线数</p>
    </li>
    <li class="user_Overview-item" style="color: #e3b337">
      <div class="user_Overview_nums offline">
        <VCountUp :end-val="state.offlineNum" :duration="duration" />
      </div>
      <p>掉线数</p>
    </li>
    <li class="user_Overview-item" style="color: #f5023d">
      <div class="user_Overview_nums laramnum">
        <VCountUp :end-val="state.alarmNum" :duration="duration" />
      </div>
      <p>告警次数</p>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.left-top {
  width: 100%;
  height: 100%;
}

.user_Overview {
  li {
    flex: 1;

    p {
      text-align: center;
      height: 16px;
      font-size: 16px;
    }

    .user_Overview_nums {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 22px;
      margin: 50px auto 30px;
      background-size: cover;
      background-position: center center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &.bgdonghua::before {
        animation: rotating 14s linear infinite;
      }
    }

    .allnum {
      &::before {
        background-image: url('/assets/v/left_top_lan.png');
      }
    }

    .online {
      &::before {
        background-image: url('/assets/v/left_top_lv.png');
      }
    }

    .offline {
      &::before {
        background-image: url('/assets/v/left_top_huang.png');
      }
    }

    .laramnum {
      &::before {
        background-image: url('/assets/v/left_top_hong.png');
      }
    }
  }
}
</style>
