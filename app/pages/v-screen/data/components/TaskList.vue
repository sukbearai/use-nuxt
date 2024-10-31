<script setup lang="ts">
import type { ElScrollbar } from 'element-plus'
import scrollIntoView from 'scroll-into-view-if-needed'
import { type Course, DataType, Step_State } from '~/types/qt'

// mock数据
const { taskList, initializeData, startDynamicUpdate } = useDynamicMockData()
initializeData()
startDynamicUpdate()

const taskListEl = ref(null)
const { height } = useElementSize(taskListEl)
const scrollbarRefEl = ref<InstanceType<typeof ElScrollbar>>()
const listHeight = computed(() => `${height.value - 20}px`)
const list = ref<Course[]>([])

const stepRefs = ref(new Map())

watch(taskList, (value) => {
  const doingStep = value.flatMap(course => course.stepList).reverse().find(step => step.stepState === Step_State.DOING)
  if (doingStep) {
    scrollToStep(doingStep.stepId)
  }
}, {
  deep: true,
  immediate: true,
})

function setStepRef(el: Element | ComponentPublicInstance | null, stepId: string) {
  if (el)
    stepRefs.value.set(stepId, el)
}

function scrollToStep(stepId: string) {
  const el = stepRefs.value.get(stepId)
  if (el) {
    scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' })
  }
}

const { connect, disconnect } = useWebChannel()

const cbId = connect<Course[]>((data) => {
  switch (data.type) {
    case DataType.TASK_INFO:
      list.value = data.payload!

      nextTick(() => {
        const doingStep = list.value.flatMap(course => course.stepList).find(step => step.stepState === Step_State.DOING)
        if (doingStep) {
          scrollToStep(doingStep.stepId)
        }
      })
      break
    default:
      console.warn(`Unknown data type: ${data.type}`)
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})
</script>

<template>
  <div ref="taskListEl" class="task-list">
    <a-scrollbar ref="scrollbarRefEl" :style="`height:${listHeight};overflow-y: auto;max-height: 362px;`">
      <div class="scroll-area">
        <el-steps direction="vertical" :active="0">
          <el-step v-for="item in taskList" :key="item.taskId">
            <template #title>
              <div class="flex justify-between">
                <div class="text-sm">
                  {{ item.taskName }}
                </div>
                <!-- <div>
                  <el-text class="mx-1" type="primary">
                    未开始
                  </el-text>
                  <el-text class="mx-1" type="success">
                    已开始
                  </el-text>
                  <el-text class="mx-1" type="info">
                    已完成
                  </el-text>
                  <el-progress :width="20" type="circle" :percentage="80" :show-text="false" />
                </div> -->
              </div>
            </template>
            <template #description>
              <ul>
                <li
                  v-for="t in item.stepList"
                  :key="t.stepId"
                  :ref="el => setStepRef(el, t.stepId)"
                  class="my-2 flex justify-between text-[#409eff]"
                >
                  <div class="w-[85%] text-xs">
                    {{ t.description }}
                  </div>
                  <div>
                    <el-text v-if="t.stepState === Step_State.NOT_STARTED" class="mx-1 text-xs" type="primary">
                      未开始
                    </el-text>
                    <el-text v-else-if="t.stepState === Step_State.DOING" class="mx-1 text-xs" type="success">
                      已开始
                    </el-text>
                    <el-text v-else class="mx-1 text-xs" type="primary">
                      已完成
                    </el-text>
                  </div>
                </li>
              </ul>
            </template>
          </el-step>
        </el-steps>
      </div>
    </a-scrollbar>
  </div>
</template>

<style>
.el-step__description {
  padding-right: 0px;
}
</style>

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
