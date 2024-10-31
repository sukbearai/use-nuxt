<script setup lang="ts">
import WebCamera from './components/WebCamera.vue'
import TaskList from './components/TaskList.vue'
import AIAvatar from './components/AIAvatar.vue'
import AIEvaluate from './components/AIEvaluate.vue'
import VPlatform from './components/VPlatform.vue'
import VScene from './components/VScene.vue'
import VEnvironment from './components/VEnvironment.vue'
import { CameraId, type Course, DataType, type QTResponseType } from '~/types/qt'

// mock数据
const { chatList, evaluateList, initializeData, startDynamicUpdate } = useDynamicMockData()

initializeData()
startDynamicUpdate()

definePageMeta({
  layout: 'home',
})

interface CommentItem {
  taskName: string
  description: string
  comment: string
  score: string
}

const defaultFrameUrl = 'https://dcy-static.oss-cn-hangzhou.aliyuncs.com/app/scene-perception-system/scan.png'

const sequenceFrameOne = ref(defaultFrameUrl)
const sequenceFrameTwo = ref(defaultFrameUrl)
const sequenceFrameThree = ref(defaultFrameUrl)
const commentList = ref<CommentItem[]>([])
// const commentEl = ref(null)
// const { height } = useElementSize(commentEl)

const { sendMessageToCpp, connect, disconnect } = useWebChannel()

const cbId = connect<Course[]>((data) => {
  switch (data.type) {
    case DataType.VIDEO_FRAME:
      handleVideoFrame(data)
      break
    case DataType.TASK_INFO:
      handleTaskComment(data)
      break
    default:
      console.warn(`Unknown data type: ${data.type}`)
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})

function handleVideoFrame(data: QTResponseType) {
  // https://dcy-test.oss-cn-hangzhou.aliyuncs.com/images/face-demo.png
  switch (data.cam_id) {
    case CameraId.PTZ:
      sequenceFrameOne.value = data.img!
      break
    case CameraId.FACE:
      sequenceFrameTwo.value = data.img!
      break
    case CameraId.TRACK:
      sequenceFrameThree.value = data.img!
      break
    default:
      console.warn(`Unknown camera ID: ${data.cam_id}`)
  }
}

function handleTaskComment(data: QTResponseType<Course[]>) {
  commentList.value = data.payload!.flatMap(item =>
    item.stepList
      .filter(step => step.ai_state === '1')
      .map(step => ({
        taskName: item.taskName,
        description: step.description,
        comment: step.ai_comment,
        score: step.ai_score,
      })),
  )
}

// 心跳检测
useHeartBeat('v', '1', sendMessageToCpp)
</script>

<template>
  <div class="index-box text-sm">
    <div class="grid-box">
      <div class="grid-top__area">
        <div class="grid-item">
          <VItemWrap bg="sm" title-class="title-task">
            <TaskList />
          </VItemWrap>
        </div>
        <div class="grid-item">
          <VItemWrap bg="camera" title-class="title-camera-h">
            <WebCamera :sequence-frame="sequenceFrameOne" />
          </VItemWrap>
        </div>
        <div class="grid-item">
          <VItemWrap bg="camera" title-class="title-camera-v">
            <WebCamera :sequence-frame="sequenceFrameTwo" />
          </VItemWrap>
        </div>
      </div>
      <div class="grid-bottom__area">
        <div class="grid-item">
          <VItemWrap bg="sm" title-class="title-evaluation">
            <div style="height: 346px">
              <Vue3Marquee :vertical="true" :pause="false" :duration="120">
                <AIEvaluate v-for="(item, index) in evaluateList" :key="index" :task-name="item.taskName" :score="item.score" :description="item.description" :comment="item.comment" />
              </Vue3Marquee>
            </div>
          </VItemWrap>
        </div>
        <div class="grid-item">
          <VItemWrap>
            <AIAvatar :list="chatList" />
          </VItemWrap>
        </div>
        <div class="grid-item device-information">
          <div class="camera">
            <VItemWrap bg="camera" title-class="title-camera-task">
              <WebCamera :sequence-frame="sequenceFrameThree" />
            </VItemWrap>
          </div>
          <div class="platform">
            <VItemWrap bg="mini" title-class="title-platform">
              <div style="height: 100px;padding-bottom: 20px;">
                <Vue3Marquee :vertical="true">
                  <VPlatform />
                </Vue3Marquee>
              </div>
            </VItemWrap>
          </div>
          <div class="scene">
            <VItemWrap bg="mini" title-class="title-scene">
              <div style="height:48px">
                <Vue3Marquee :vertical="true" :pause="true">
                  <VScene />
                </Vue3Marquee>
              </div>
            </VItemWrap>
          </div>
          <div class="env">
            <VItemWrap bg="env" title-class="title-env">
              <VEnvironment />
            </VItemWrap>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vue3-marquee.vertical {
  width: 100%;
}
</style>

<style scoped lang="scss">
.vue3-marquee.vertical {
  width: 100%;
}
</style>

<style scoped lang="scss">
.index-box {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.grid-box {
  margin-top: 38px;
  padding: 0 48px;
}

.grid-top__area {
  display: grid;
  grid-template-columns: 4fr 7fr 7fr; /* First row columns: 4:5:5 ratio */
  gap: 14px;

  .grid-item {
    // overflow-y: auto;
    height: 441px;
  }
}

.grid-bottom__area {
  display: grid;
  grid-template-columns: 8fr 16fr 12fr; /* First row columns: 4:5:5 ratio */
  margin-top: 16px;
  gap: 14px;

  .grid-item {
    // overflow-y: auto;
    height: 485px;
  }
}

.device-information {
  display: grid;
  height: 484px;
  gap: 12px;
  grid-template-columns: 7fr 3fr; /* 三列等分 */
  grid-template-rows: 4fr 5fr 6fr;
  grid-template-areas:
    'camera platform' /* 第一行，header 跨三列 */
    'camera scene' /* 第二行，sidebar 跨一列，content 跨两列 */
    'env env'; /* 第二行，sidebar 跨一列，content 跨两列 */
}

.camera {
  grid-area: camera;
}

.platform {
  grid-area: platform;
}

.scene {
  grid-area: scene;
}

.env {
  grid-area: env;
}
</style>
