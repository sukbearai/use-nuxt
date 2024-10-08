<!-- eslint-disable no-async-promise-executor -->
<script setup lang="ts">
import type { MapdataType } from './center.map'
import { getMap, registerMap } from 'echarts/core'
import { centerMap, getMapData } from '~/services/v'
import { optionHandle, regionCodes } from './center.map'

// china 代表中国 其他地市是行政编码
withDefaults(
  defineProps<{
    // 结束数值
    title: number | string
  }>(),
  {
    title: '地图',
  },
)
const option = ref({})
const code = ref('china')
async function dataSetHandle(regionCode: string, list: object[]) {
  const geojson: any = await getGeojson(regionCode)
  const cityCenter: any = {}
  const mapData: MapdataType[] = []
  // 获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] = element.properties.centroid || element.properties.center
  })
  // 当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      })
    }
  })
  await nextTick()

  option.value = optionHandle(regionCode, list, mapData)
}

async function getData(regionCode: string) {
  centerMap({ regionCode })
    .then((res: any) => {
      if (res.data.success) {
        dataSetHandle(res.data.data.regionCode, res.data.data.dataList)
      }
      else {
        ElMessage.error(res.data.msg)
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}
function getGeojson(regionCode: string) {
  return new Promise<boolean>(async (resolve) => {
    let mapjson = getMap(regionCode)
    if (mapjson) {
      mapjson = mapjson.geoJSON
      resolve(mapjson)
    }
    else {
      mapjson = await getMapData(`/map-geojson/${regionCode}.json`).then(data => data)
      code.value = regionCode
      registerMap(regionCode, {
        geoJSON: mapjson as any,
        specialAreas: {},
      })
      resolve(mapjson)
    }
  })
}
getData(code.value)

function mapClick(params: any) {
  // console.log(params);
  const xzqData = regionCodes[params.name]
  if (xzqData) {
    getData(xzqData.adcode)
  }
}
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo" />
      <span class="titletext">{{ title }}</span>
      <div class="you" />
    </div>
    <div class="mapwrap">
      <VBorderBox13>
        <div v-if="code !== 'china'" class="quanguo" @click="getData('china')">
          中国
        </div>
        <v-chart
          v-if="JSON.stringify(option) !== '{}'"
          class="chart"
          :option="option"
          @click="mapClick"
        />
      </VBorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url('/assets/v/xiezuo.png') no-repeat;
    }

    .you {
      background: url('/assets/v/xieyou.png') no-repeat;
    }
  }

  .mapwrap {
    height: 580px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow:
        0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }
  }
}
</style>
