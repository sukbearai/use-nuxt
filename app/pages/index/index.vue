<script setup lang="ts">
import CenterBottom from './components/center-bottom.vue'
import CenterMap from './components/center-map.vue'
import LeftBottom from './components/left-bottom.vue'
import LeftCenter from './components/left-center.vue'
import LeftTop from './components/left-top.vue'
import RightBottom from './components/right-bottom.vue'
import RightCenter from './components/right-center.vue'
import RightTop from './components/right-top.vue'

definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <!-- <div class="pagetab">
        <div class="item">实时监测</div>
        <div class="item">统计分析</div>
      </div> -->
      <VItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
        <LeftTop />
      </VItemWrap>
      <VItemWrap class="contetn_lr-item contetn_left-center" title="用户总览">
        <LeftCenter />
      </VItemWrap>
      <VItemWrap
        class="contetn_lr-item contetn_left-bottom"
        title="设备提醒"
        style="padding: 0 10px 16px 10px"
      >
        <LeftBottom />
      </VItemWrap>
    </div>
    <div class="contetn_center">
      <CenterMap class="contetn_center_top" title="设备分布图" />
      <VItemWrap class="contetn_center-bottom" title="安装计划">
        <CenterBottom />
      </VItemWrap>
    </div>
    <div class="contetn_right">
      <VItemWrap class="contetn_left-bottom contetn_lr-item" title="报警次数">
        <RightTop />
      </VItemWrap>
      <VItemWrap
        class="contetn_left-bottom contetn_lr-item"
        title="报警排名(TOP8)"
        style="padding: 0 10px 16px 10px"
      >
        <RightCenter />
      </VItemWrap>
      <VItemWrap class="contetn_left-bottom contetn_lr-item" title="数据统计图 ">
        <RightBottom />
      </VItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}
//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.contetn_center {
  flex: 1;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
