<script lang="ts" setup>
import {
  BarChart,
  EffectScatterChart,
  LineChart,
  MapChart,
  PieChart,
} from 'echarts/charts'
import {
  DatasetComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VCharts from 'vue-echarts'

defineProps({
  option: {
    type: Object,
    default() {
      return {}
    },
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
})

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  MapChart,
  EffectScatterChart,
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  DatasetComponent,
  VisualMapComponent,
  GeoComponent,
  MarkPointComponent,
])

const renderChart = ref(false)
// wait container expand
nextTick(() => {
  renderChart.value = true
})
</script>

<template>
  <VCharts
    v-if="renderChart"
    :option="option"
    :autoresize="autoResize"
    :style="{ width, height }"
  />
</template>

<style scoped></style>
