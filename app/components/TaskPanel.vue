<script setup lang="ts">
import type { ElScrollbar } from 'element-plus'
import { useElementSize } from '@vueuse/core'
import { computed, ref } from 'vue'

type Status = 'progress' | 'success' | 'error' | 'warning' | 'info'

interface Step {
  title: string
  description: string[]
  status: Status
}

const taskListEl = ref(null)
const { height } = useElementSize(taskListEl)
// const currentRefEl = ref<HTMLElement | ComponentPublicInstance | null>(null)
const scrollbarRefEl = ref<InstanceType<typeof ElScrollbar>>()
const listHeight = computed(() => `${height.value - 10}px`)
const dialog = ref(false)
const stepsData = ref<Step[]>([])

function generateSteps(initialStep: Step, count: number): Step[] {
  const steps: Step[] = []
  for (let i = 0; i < count; i++) {
    const newStep: Step = {
      ...initialStep,
      title: `步骤${i + 1}: ${initialStep.title}`,
      description: initialStep.description.map((desc, index) => `步骤${i + 1}-${index + 1}: ${desc}`),
    }
    // 这里可以根据需要随机生成其他属性，比如 status
    steps.push(newStep)
  }
  return steps
}

// function onClick() {
//   (currentRefEl.value as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
// }

const initialStep: Step = {
  title: '初始步骤',
  description: ['步骤1', '步骤2', '步骤3'],
  status: 'progress',
}

onMounted(() => {
  stepsData.value = generateSteps(initialStep, 18)
})
</script>

<template>
  <div class="task-panel mt-4 h-full">
    <el-card class="h-full">
      <div class="h-full w-full flex">
        <div class="task-panel_left">
          <div class="mb-4 flex items-center justify-between">
            <div class="text-lg">
              阶段一:
            </div>
            <div>
              <el-button type="primary" @click="dialog = true">
                AI助教
              </el-button>
            </div>
          </div>
          <div ref="taskListEl" class="task-list flex-1">
            <el-scrollbar ref="scrollbarRefEl" :height="listHeight">
              <div class="scroll-area">
                <el-steps direction="vertical" :active="0">
                  <el-step v-for="item in stepsData" :key="item.title">
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
                </el-steps>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="ml-8 flex-1 bg-light">
          <el-scrollbar :height="listHeight">
            我是富文本内容 {{ listHeight }}
          </el-scrollbar>
        </div>
      </div>
    </el-card>
    <!-- AI助教 -->
    <AiAssistant v-model="dialog" />
  </div>
</template>

<style scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}

.task-panel {
  max-height: 100%;
  overflow: hidden;
}

.task-panel_left {
  width: 28% !important;
  min-width: 518px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.task-list {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.task-list ul li {
  padding: 8px 0 8px 20px;
  border-left: 2px solid var(--el-text-color-placeholder);
  margin: 0;
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
