<script setup lang="ts">
import { leftBottom } from '~/services/v'

const settingStore = useSettingStore()
const { defaultOption, indexConfig } = storeToRefs(settingStore)
const state = reactive<any>({
  list: [],
  defaultOption: {
    ...defaultOption.value,
    singleHeight: 256,
    limitScrollNum: 4,
  },
  scroll: true,
})

function getData() {
  leftBottom({ limitNum: 20 })
    .then((res: any) => {
      if (res.data.success) {
        state.list = res.data.data.list
      }
      else {
        ElMessage({
          message: res.data.msg,
          type: 'warning',
        })
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}
function addressHandle(item: any) {
  let name = item.provinceName
  if (item.cityName) {
    name += `/${item.cityName}`
    if (item.countyName) {
      name += `/${item.countyName}`
    }
  }
  return name
}
const comName = computed(() => {
  if (indexConfig.value.leftBottomSwiper) {
    return 'VSeamlessScroll'
  }
  else {
    return 'VEmptyCom'
  }
})
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="beautify-scroll-def left_boottom_wrap" :class="{ 'overflow-y-auto': !indexConfig.leftBottomSwiper }">
    <component
      :is="comName"
      v-model="state.scroll"
      :list="state.list"
      :single-height="state.defaultOption.singleHeight"
      :step="state.defaultOption.step"
      :limit-scroll-num="state.defaultOption.limitScrollNum"
      :hover="state.defaultOption.hover"
      :single-wait-time="state.defaultOption.singleWaitTime"
      :wheel="state.defaultOption.wheel"
    >
      <ul class="left_boottom">
        <li v-for="(item, i) in state.list" :key="i" class="left_boottom_item">
          <span class="orderNum doudong">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu" />
            <div class="flex">
              <div class="info">
                <span class="labels">设备ID：</span>
                <span class="doudong zhuyao wangguan text-content"> {{ item.gatewayno }}</span>
              </div>
              <div class="info">
                <span class="labels">时间：</span>
                <span class="text-content" style="font-size: 12px"> {{ item.createTime }}</span>
              </div>
            </div>

            <span
              class="doudong types"
              :class="{
                typeRed: item.onlineState === 0,
                typeGreen: item.onlineState === 1,
              }"
            >{{ item.onlineState === 1 ? "上线" : "下线" }}</span>

            <div class="info addresswrap">
              <span class="labels">地址：</span>
              <span class="text-content ciyao" style="font-size: 12px"> {{ addressHandle(item) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped lang="scss">
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.doudong {
  overflow: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;

  .left_boottom_item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    font-size: 14px;
    margin: 10px 0;
    .orderNum {
      margin: 0 16px 0 -20px;
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      color: #fff;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: #1890ff;
        font-size: 15px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #e6a23c;
        font-size: 15px;
      }
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 380px;
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url('/assets/v/zuo_xuxian.png');
        bottom: -10px;
        left: -2%;
        background-size: cover;
      }
      .addresswrap {
        width: 100%;
        display: flex;
        margin-top: 8px;
      }
    }

    .wangguan {
      color: #1890ff;
      font-weight: 900;
      font-size: 15px;
      width: 80px;
      flex-shrink: 0;
    }

    .time {
      font-size: 12px;
      // color: rgba(211, 210, 210,.8);
      color: #fff;
    }

    .address {
      font-size: 12px;
      cursor: pointer;
      // @include text-overflow(1);
    }

    .types {
      width: 30px;
      flex-shrink: 0;
    }

    .typeRed {
      color: #fc1a1a;
    }

    .typeGreen {
      color: #29fc29;
    }
  }
}
</style>
