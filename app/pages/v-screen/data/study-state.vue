<script setup lang="ts">
import { graphic } from 'echarts/core'
import { alarmNum } from '~/services/v'

const option = ref({})
function getData() {
  alarmNum()
    .then((res) => {
      if (res.data.success) {
        setOption(res.data.data.dateList, res.data.data.numList, res.data.data.numList2)
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
async function setOption(xData: any[], yData: any[], yData2: any[]) {
  option.value = {
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false, // 不留白，从原点开始
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(31,99,163,.2)',
        },
      },
      axisLine: {
        // show:false,
        lineStyle: {
          color: 'rgba(31,99,163,.1)',
        },
      },
      axisLabel: {
        color: '#7EB7FD',
        fontWeight: '500',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(31,99,163,.2)',
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(31,99,163,.1)',
        },
      },
      axisLabel: {
        color: '#7EB7FD',
        fontWeight: '500',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,.6)',
      borderColor: 'rgba(147, 235, 248, .8)',
      textStyle: {
        color: '#FFF',
      },
    },
    grid: {
      // 布局
      show: true,
      left: '10px',
      right: '30px',
      bottom: '10px',
      top: '32px',
      containLabel: true,
      borderColor: '#1F63A3',
    },
    series: [
      {
        data: yData,
        type: 'line',
        smooth: true,
        symbol: 'none', // 去除点
        name: '报警1次数',
        color: 'rgba(252,144,16,.7)',
        areaStyle: {
          // 右，下，左，上
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(252,144,16,.7)',
              },
              {
                offset: 1,
                color: 'rgba(252,144,16,.0)',
              },
            ],
            false,
          ),
        },
        markPoint: {
          data: [
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'rect',
              symbolSize: [60, 26],
              symbolOffset: [0, -20],
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              label: {
                color: '#FC9010',
                backgroundColor: 'rgba(252,144,16,0.1)',
                borderRadius: 6,
                padding: [7, 14],
                borderWidth: 0.5,
                borderColor: 'rgba(252,144,16,.5)',
                formatter: '报警1：{c}',
              },
            },
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#FC9010',
                shadowColor: '#FC9010',
                shadowBlur: 8,
              },
              label: {
                formatter: '',
              },
            },
          ],
        },
      },
      {
        data: yData2,
        type: 'line',
        smooth: true,
        symbol: 'none', // 去除点
        name: '报警2次数',
        color: 'rgba(9,202,243,.7)',
        areaStyle: {
          // 右，下，左，上
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(9,202,243,.7)',
              },
              {
                offset: 1,
                color: 'rgba(9,202,243,.0)',
              },
            ],
            false,
          ),
        },
        markPoint: {
          data: [
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'rect',
              symbolSize: [60, 26],
              symbolOffset: [0, -20],
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              label: {
                color: '#09CAF3',
                backgroundColor: 'rgba(9,202,243,0.1)',

                borderRadius: 6,
                borderColor: 'rgba(9,202,243,.5)',
                padding: [7, 14],
                formatter: '报警2：{c}',
                borderWidth: 0.5,
              },
            },
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#09CAF3',
                shadowColor: '#09CAF3',
                shadowBlur: 8,
              },
              label: {
                formatter: '',
              },
            },
          ],
        },
      },
    ],
  }
}
const studyStateEl = ref(null)
const { height } = useElementSize(studyStateEl)
const listHeight = computed(() => `${height.value - 20}px`)

onMounted(() => {
  getData()
})
</script>

<template>
  <div ref="studyStateEl" class="study-state relative">
    <el-carousel :height="listHeight" motion-blur arrow="never" :interval="5000" :autoplay="false">
      <el-carousel-item v-for="item in 4" :key="item" class="" label="名字">
        <div class="h-full w-full flex">
          <v-chart v-if="JSON.stringify(option) !== '{}'" :autoresize="true" class="chart" :option="option" />
          <v-chart v-if="JSON.stringify(option) !== '{}'" :autoresize="true" class="chart" :option="option" />
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="absolute bottom-2 text-sm text-[#d3d6dd]">
      <div>情绪：积极</div>
      <div>健康状况：良好</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-carousel__indicators--labels) {
  top: 0;
  right: 0;
  text-align: right;
}

.study-state {
  width: 100%;
  height: 100%;

  .chart {
    width: 50%;
    height: calc(100% - 20px);
    padding: 20px 0;
    margin-top: 10px;
  }
}
</style>
