<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import type { ElScrollbar } from 'element-plus'
import { type Course, DataType, Step_State } from '~/types/qt'
import { QTClientSDK } from '~/services/qt'

const sdk = new QTClientSDK()

// 任务列表高度计算
const taskListEl = ref(null)
// 富文本高度计算
const richTextEl = ref(null)
const { height: tlHeight } = useElementSize(taskListEl)
const { height: rtHeight } = useElementSize(richTextEl)
// const currentRefEl = ref<HTMLElement | ComponentPublicInstance | null>(null)
const scrollbarRefEl = ref<InstanceType<typeof ElScrollbar>>()
const listHeight = computed(() => `${tlHeight.value - 10}px`)
const textHeight = computed(() => `${rtHeight.value}px`)
const dialog = ref(false)
const list = ref<Course[]>([])
const title = ref('')
const text = ref('')

// function onClick() {
//   (currentRefEl.value as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
// }

const { connect, disconnect, sendMessageToCpp } = useWebChannel()

const cbId = connect<Course[]>((data) => {
  switch (data.type) {
    case DataType.TASK_INFO:
      list.value = data.payload!
      title.value = data.stage_name!
      break
    default:
      console.warn(`Unknown data type: ${data.type}`)
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})

function handleClickStart(id: string) {
  sendMessageToCpp(sdk.createClickStepDTO(id, '0'))
}

function handleClickEnd(id: string) {
  sendMessageToCpp(sdk.createClickStepDTO(id, '1'))
}

function handleSwitchDesc(id: string) {
  text.value = list.value.find(item => item.taskId === id)?.content || ''
}

const currentStepId = computed(() => {
  // 获取所有步骤
  const allSteps = list.value.flatMap(item => item.stepList)
  // 用户正在执行的步骤
  const activeStep = allSteps.find(step => step.stepState === Step_State.DOING)

  if (activeStep) {
    return activeStep.stepId
  }
  else {
    // 检查所有步骤的状态是否都完成
    if (allSteps.every(step => step.stepState === Step_State.COMPLETED)) {
      return false
    }
    else {
      // 默认返回第一个未开始的步骤
      return allSteps[(allSteps.findIndex(step => step.stepState === Step_State.COMPLETED)) + 1]?.stepId || allSteps[0]?.stepId
    }
  }
})
</script>

<template>
  <div class="task-panel mt-4 h-full">
    <el-card class="h-full">
      <div class="h-full w-full flex">
        <div class="task-panel_left">
          <div class="mb-4 flex items-center justify-between">
            <div class="text-lg">
              {{ title }}
            </div>
            <div class="h-[28px] w-[72px] flex cursor-pointer items-center justify-center rounded-[14px] from-[#C488FF] to-[#6B6AFF] bg-gradient-to-r text-white" @click="dialog = true">
              AI助教
            </div>
          </div>
          <div ref="taskListEl" class="task-list flex-1">
            <el-scrollbar ref="scrollbarRefEl" :height="listHeight">
              <div class="scroll-area">
                <el-steps direction="vertical" :active="0">
                  <el-step v-for="item in list" :key="item.taskId">
                    <template #title>
                      <div class="flex justify-between">
                        <div @click="handleSwitchDesc(item.taskId)">
                          {{ item.taskName }}
                        </div>
                        <!-- <div>
                          <el-text class="mx-1" type="primary">未开始</el-text>
                          <el-text class="mx-1" type="success">已开始</el-text>
                          <el-text class="mx-1" type="info">已完成</el-text>
                          <el-progress :width="20" type="circle" :percentage="80" :show-text="false" />
                        </div> -->
                      </div>
                    </template>
                    <template #description>
                      <ul>
                        <li
                          v-for="(t, i) in item.stepList"
                          :key="t.stepId"
                          class="my-2 flex justify-between text-[#409eff]"
                        >
                          <el-tooltip
                            effect="light"
                            placement="bottom-start"
                          >
                            <template #content>
                              <div class="py-2 py-4">
                                <div class="flex items-center justify-between">
                                  <div class="text-sm">
                                    过程评价
                                  </div>
                                  <div class="text-xl font-bold">
                                    {{ t.ai_score }}<span class="text-sm font-normal">分</span>
                                  </div>
                                </div>
                                <div class="mt-4 text-xs">
                                  {{ t.ai_comment }}
                                </div>
                              </div>
                            </template>
                            <div class="flex">
                              <div>{{ `${i + 1}、 ${t.description}` }}</div>
                              <div v-if="t.ai_state === '1'" class="ml-1">
                                <span class="text-[14px] text-green">查看AI评价</span>
                                <!-- <el-icon style="vertical-align: middle">
                                  <SuccessFilled color="#4ade80" />
                                </el-icon> -->
                              </div>
                            </div>
                          </el-tooltip>
                          <div>
                            <el-button v-if="t.stepState === Step_State.NOT_STARTED" :disabled="currentStepId ? currentStepId !== t.stepId : false" class="mx-1" type="primary" size="small" @click="handleClickStart(t.stepId)">
                              开始
                            </el-button>
                            <el-button v-else-if="t.stepState === Step_State.DOING" :disabled="currentStepId ? currentStepId !== t.stepId : false" class="mx-1" type="primary" size="small" @click="handleClickEnd(t.stepId)">
                              完成
                            </el-button>
                            <el-text v-else class="mx-1" type="success">
                              已完成
                            </el-text>
                          </div>
                        </li>
                      </ul>
                    </template>
                  </el-step>
                </el-steps>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div ref="richTextEl" class="ml-8 flex-1 bg-light">
          <el-scrollbar :height="textHeight">
            <!-- <rich-text v-model="text" inline /> -->
            <div v-html="text" />
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
