<script setup lang="ts">
import { rightBottom } from '~/services/v'

const settingStore = useSettingStore()
const { defaultOption, indexConfig } = storeToRefs(settingStore)
const state = reactive<any>({
  list: [],
  defaultOption: {
    ...defaultOption.value,
    singleHeight: 252,
    limitScrollNum: 3,
    // step:3
  },
  scroll: true,
})

function getData() {
  rightBottom({ limitNum: 20 })
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

const comName = computed(() => {
  if (indexConfig.value.rightBottomSwiper) {
    return 'VSeamlessScroll'
  }
  else {
    return 'VEmptyCom'
  }
})
function montionFilter(val: any) {
  // console.log(val);
  return val ? Number(val).toFixed(2) : '--'
}
function handleAddress(item: any) {
  return `${item.provinceName}/${item.cityName}/${item.countyName}`
}
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="beautify-scroll-def right_bottom_wrap" :class="{ 'overflow-y-auto': !indexConfig.rightBottomSwiper }">
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
      <ul class="right_bottom">
        <li v-for="(item, i) in state.list" :key="i" class="right_center_item">
          <span class="orderNum">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu" />
            <div class="flex">
              <div class="info">
                <span class="labels">设备ID：</span>
                <span class="zhuyao text-content"> {{ item.gatewayno }}</span>
              </div>
              <div class="info">
                <span class="labels">型号：</span>
                <span class="text-content"> {{ item.terminalno }}</span>
              </div>
              <div class="info">
                <span class="labels">告警值：</span>
                <span class="text-content warning"> {{ montionFilter(item.alertvalue) }}</span>
              </div>
            </div>

            <div class="flex">
              <div class="info">
                <span class="labels shrink-0"> 地址：</span>
                <span class="ciyao truncate" style="font-size: 12px; width: 220px" :title="handleAddress(item)">
                  {{ handleAddress(item) }}</span>
              </div>
              <div class="info time shrink-0">
                <span class="labels">时间：</span>
                <span class="text-content" style="font-size: 12px"> {{ item.createtime }}</span>
              </div>
            </div>
            <div class="flex">
              <div class="info">
                <span class="labels">报警内容：</span>
                <span class="text-content ciyao" :class="{ warning: item.alertdetail }">
                  {{ item.alertdetail || "无" }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  width: 100%;
  height: 100%;

  .right_center_item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    padding: 10px;
    font-size: 14px;
    color: #fff;

    .orderNum {
      margin: 0 20px 0 -20px;
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 400px;
      flex-shrink: 0;
      line-height: 1.5;

      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url('/assets/v/zuo_xuxian.png');
        bottom: -12px;
        left: -2%;
        background-size: cover;
      }
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;

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
  }
}

.right_bottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 252px;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
