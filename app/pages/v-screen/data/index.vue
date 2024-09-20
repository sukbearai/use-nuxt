<script setup lang="ts">
import StudyState from './study-state.vue'
import TaskList from './task-list.vue'
import WebCamera from './web-camera.vue'

definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div class="index-box text-sm">
    <div class="content_left">
      <VItemWrap class="content_left-list" title="任务列表">
        <TaskList />
      </VItemWrap>
    </div>
    <div class="content_right">
      <div class="content-right_top flex">
        <VItemWrap class="content_left-camera" title="摄像头">
          <WebCamera />
        </VItemWrap>
        <VItemWrap class="content_left-camera" title="摄像头">
          <WebCamera />
        </VItemWrap>
      </div>
      <div class="content-right_bottom flex">
        <div class="content_left-bottom__left w-1/2">
          <VItemWrap class="content_left-bottom" title="学习状态" style="padding: 0 10px 16px 10px">
            <StudyState />
          </VItemWrap>
        </div>
        <div class="content_left-bottom__right flex flex-1 flex-col">
          <div class="h-1/2 flex">
            <VItemWrap class="content_left-bottom content_lr-item" title="场景设备状态" style="padding: 0 10px 16px 10px">
              <div>状态信息</div>
              <div>参数信息</div>
            </VItemWrap>
            <VItemWrap class="content_left-bottom content_lr-item" title="多轴联动平台" style="padding: 0 10px 16px 10px">
              <div>PLC状态：正常</div>
              <div>伺服电机1：正常</div>
              <div>伺服电机2：正常</div>
            </VItemWrap>
          </div>
          <div class="flex-1">
            <VItemWrap class="content_left-bottom content_lr-item" title="环境信息" style="padding: 0 10px 16px 10px">
              <div>仪表盘</div>
            </VItemWrap>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
  color: #d3d6dd;
}

//左边 右边 结构一样
.content_left,
.content_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.content_right {
  flex: 1;

  .content_left-camera {
    height: 45vh;
  }

  .content-right_bottom {
    flex: 1;
  }
}
</style>
