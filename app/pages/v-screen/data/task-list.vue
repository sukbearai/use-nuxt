<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ElScrollbar } from 'element-plus'

const taskListEl = ref(null)
const { height } = useElementSize(taskListEl)
const currentRefEl = ref<HTMLElement | ComponentPublicInstance | null>(null)
const scrollbarRefEl = ref<InstanceType<typeof ElScrollbar>>()
const listHeight = computed(() => `${height.value - 20}px`)

function onClick() {
  (currentRefEl.value as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div ref="taskListEl" class="task-list">
    <ElScrollbar ref="scrollbarRefEl" :height="listHeight">
      <div class="scroll-area">
        <el-steps direction="vertical" :active="0">
          <el-step>
            <template #title>
              <div class="flex justify-between">
                <div>OpenHarmony环境配置_Windows</div>
                <div>
                  <!-- <el-text class="mx-1" type="primary">未开始</el-text>
                                    <el-text class="mx-1" type="success">已开始</el-text>
                                    <el-text class="mx-1" type="info">已完成</el-text> -->
                  <el-progress :width="20" type="circle" :percentage="80" :show-text="false" />
                </div>
              </div>
            </template>
            <template #description>
              <ul>
                <li class="my-2 flex justify-between text-[#409eff]">
                  <div>step1: 安装VMware-workstation</div>
                  <div>
                    <!-- <el-text class="mx-1" type="primary">未开始</el-text>
                                        <el-text class="mx-1" type="success">已开始</el-text>
                                        <el-text class="mx-1" type="primary">已完成</el-text> -->
                  </div>
                </li>
                <li class="my-2">
                  step2: 安装Ubuntu镜像
                </li>
                <li class="my-2">
                  step3: 测试虚拟机是否可连接网络
                </li>
                <li class="my-2">
                  step4: 安装SSH服务
                </li>
              </ul>
            </template>
          </el-step>
          <el-step>
            <template #title>
              <div class="flex justify-between">
                <div>OpenHarmony环境配置_Linux</div>
                <div>
                  <el-text class="mx-1" type="primary">
                    未开始
                  </el-text>
                  <!-- <el-text class="mx-1" type="success">已开始</el-text>
                                    <el-text class="mx-1" type="info">已完成</el-text> -->
                </div>
              </div>
            </template>
            <template #description>
              <ul>
                <li class="my-2">
                  step1: 安装VMware-workstation
                </li>
                <li class="my-2 text-[#409eff]">
                  step2: 安装Ubuntu镜像
                </li>
                <li class="my-2">
                  step3: 测试虚拟机是否可连接网络
                </li>
                <li class="my-2">
                  step4: 安装SSH服务
                </li>
              </ul>
            </template>
          </el-step>
          <el-step>
            <template #title>
              <div class="flex justify-between">
                <div>OpenHarmony系统调试实验_"Hello World"</div>
                <div>
                  <el-text class="mx-1" type="primary">
                    未开始
                  </el-text>
                  <!-- <el-text class="mx-1" type="success">已开始</el-text>
                                    <el-text class="mx-1" type="info">已完成</el-text> -->
                </div>
              </div>
            </template>
            <template #description>
              <ul>
                <li class="my-2">
                  step1: 安装VMware-workstation
                </li>
                <li class="my-2">
                  step2: 安装Ubuntu镜像
                </li>
                <li class="my-2">
                  step3: 测试虚拟机是否可连接网络
                </li>
                <li class="my-2">
                  step4: 安装SSH服务
                </li>
              </ul>
            </template>
          </el-step>
          <el-step>
            <template #title>
              <div class="flex justify-between">
                <div>OpenHarmony系统驱动实验-红外对管收发</div>
                <div>
                  <el-text class="mx-1" type="primary">
                    未开始
                  </el-text>
                  <!-- <el-text class="mx-1" type="success">已开始</el-text>
                                    <el-text class="mx-1" type="info">已完成</el-text> -->
                </div>
              </div>
            </template>
            <template #description>
              <ul>
                <li class="my-2">
                  step1: 安装VMware-workstation
                </li>
                <li class="my-2">
                  step2: 安装Ubuntu镜像
                </li>
                <li class="my-2">
                  step3: 测试虚拟机是否可连接网络
                </li>
                <li class="my-2">
                  step4: 安装SSH服务
                </li>
              </ul>
            </template>
          </el-step>
          <el-step>
            <template #title>
              <div class="flex justify-between">
                <div>OpenHarmony系统驱动实验-红外对管收发</div>
                <div>
                  <el-text class="mx-1" type="primary">
                    未开始
                  </el-text>
                  <!-- <el-text class="mx-1" type="success">已开始</el-text>
                                    <el-text class="mx-1" type="info">已完成</el-text> -->
                </div>
              </div>
            </template>
            <template #description>
              <ul>
                <li class="my-2">
                  step1: 安装VMware-workstation
                </li>
                <li class="my-2">
                  step2: 安装Ubuntu镜像
                </li>
                <li class="my-2">
                  step3: 测试虚拟机是否可连接网络
                </li>
                <li class="my-2">
                  step4: 安装SSH服务
                </li>
              </ul>
            </template>
          </el-step>
        </el-steps>
      </div>
    </ElScrollbar>
  </div>
</template>

<style scoped lang="scss">
.task-list {
  width: 100%;
  height: 100%;

  ul > li {
    padding: 8px 0 8px 20px;
    border-left: 2px solid var(--el-text-color-placeholder);
    margin: 0;
  }
}

:deep(.el-step__description.is-process) {
  color: #d3d6dd;
  font-size: 14px;
  padding-right: 0;
}

:deep(.el-step__title.is-process) {
  color: #d3d6dd;
  font-weight: normal;
}

:deep(.el-step__title.is-wait) {
  color: #d3d6dd;
}
</style>
