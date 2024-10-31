<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { Vue3Lottie } from 'vue3-lottie'
// import ChatInput from './ChatPanel/components/ChatInput.vue'
import ChatItem from './ChatPanel/components/ChatItem.vue'
import ChatPanel from './ChatPanel/index.vue'
import chatData from '~/services/chat'
import { QTClientSDK } from '~/services/qt'
import { DataType, type QTResponseType, ReturnCode, State } from '~/types/qt'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'open', 'update:model-value'])

const sdk = new QTClientSDK()

async function handleAIAssistantData(data: QTResponseType): Promise<void> {
  if (data.type === DataType.AI_ASSISTANT) {
    switch (data.ret) {
      case ReturnCode.RECORDING_STATUS:
        handleRecordingStatus(data)
        break
      case ReturnCode.VOICE_TO_TEXT:
        await handleVoiceToText(data)
        break
      case ReturnCode.AI_INFERENCE:
        await handleAIInference(data)
        break
      default:
        console.warn(`Unknown return code: ${data.ret}`)
    }
  }
}

function handleRecordingStatus(data: QTResponseType): void {
  window.console.log('录音状态', data.state)
}

async function handleVoiceToText(data: QTResponseType): Promise<void> {
  if (data.state === State.COMPLETED && data.text) {
    await sendMessage(data.text)
  }
}

async function handleAIInference(data: QTResponseType): Promise<void> {
  if (data.state === State.COMPLETED && data.text) {
    await sendMessage(data.text, false)
  }
}

const { sendMessageToCpp, connect, disconnect } = useWebChannel()

const cbId = connect((data: QTResponseType) => {
  handleAIAssistantData(data)
})

const chatWrapEl = ref()
const { height } = useElementSize(chatWrapEl)
const lottieContainerOne = ref<any>(null)
const lottieContainerTwo = ref<any>(null)
const autoPlay = ref(false)
const isRecording = ref(false)

const scrollHeight = computed(() => {
  return height.value - 120
})

const maxheight = computed(() => {
  return height.value + 20
})

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    // emit('close')
  },
})

function handleClose(done: () => void) {
  emit('close')
  done()
}

const comRef = ref()
// const inputBar = ref()
const list = ref<any>([])
const scrollbar = ref(true)
const loading = ref(true)
const top = ref(false)
const pageSize = ref(20)
const pageNo = ref(1)
const btnLoading = ref(false)
const isNoMore = ref(false)
const historiesIsEmpty = ref(false)

function queryList(pageNo: any, pageSize: any) {
  // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
  // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
  // 模拟请求服务器获取分页数据，请替换成自己的网络请求
  const params = {
    pageNo,
    pageSize,
  }

  chatData
    .queryChatListLong(params)
    .then((res: any) => {
      // 没数据了...
      if (!res.data.list.length) {
        isNoMore.value = true

        // 不存在历史数据
        if (pageNo === 1) {
          historiesIsEmpty.value = true
        }

        // 关闭加载提示
        if (loading.value) {
          loading.value = false
        }
        return
      }

      // 将请求的结果数组传递给z-paging
      list.value.unshift(...res.data.list)
      loading.value = false

      // 跟新了数据后，关闭spin展示
      if (top.value)
        top.value = false

      // 修复滚动条位置
      nextTick(() => {
        if (comRef.value)
          // comRef.value.virtualListRef.scrollToBottom()
          // 滚动条的位置应该是 pageSize-1，通过数组索引来计算滚动位置的
          comRef.value.virtualListRef.scrollTo({ index: pageSize - 1 })
      })
    })
    .catch((_res: any) => {
      // 如果请求失败写paging.value.complete(false);
      // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
      // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
    })
}

function handleReachTop() {
  // 到达顶部时触发
  // 这里可以写一些逻辑，例如加载上一页数据
  // 例如：queryList(paging.value.pageNo - 1, paging.value.pageSize);
  top.value = true
  pageNo.value += 1
  queryList(pageNo.value, pageSize.value)
}

function sendMessage(msg: string, isStudent: boolean = true) {
  return new Promise((resolve) => {
    btnLoading.value = true
    setTimeout(() => {
      list.value.push({
        time: '',
        icon: isStudent ? '/assets/daxiong.jpg' : '/assets/duola.jpg',
        name: isStudent ? '学生' : 'AI助教',
        content: msg,
        isMe: isStudent,
      })

      // 发送完消息滚动到底部
      if (comRef.value && comRef.value.virtualListRef) {
        comRef.value.virtualListRef.scrollToBottom()
      }

      btnLoading.value = false
      resolve(true)
    }, 500)
  })
}

function onSwitchAnimation() {
  if (!isRecording.value) {
    lottieContainerOne.value!.play()
    lottieContainerTwo.value!.play()
    isRecording.value = true
    window.console.log('开始录音', sdk.createMicrophoneControlDTO('0'))
    sendMessageToCpp(sdk.createMicrophoneControlDTO('0'))
  }
  else {
    lottieContainerOne.value!.stop()
    lottieContainerTwo.value!.stop()
    isRecording.value = false
    window.console.log('结束录音', sdk.createMicrophoneControlDTO('1'))
    sendMessageToCpp(sdk.createMicrophoneControlDTO('1'))
  }
}

const debounceOnSwitchAnimation = useDebounceFn(onSwitchAnimation, 500)

// watch(isRecording, async (val) => {
//   if (!val) {
//     await sendMessage('你好，AI助教', true)
//     await sendMessage('你好，我可以帮助你什么？', false)
//   }
// })

// 打开弹出框加载数据
function onOpen() {
  // 分页加载
  queryList(pageNo.value, pageSize.value)
  emit('open')
}

onBeforeUnmount(() => {
  disconnect(cbId)
})
</script>

<template>
  <div class="ai-assistant">
    <el-drawer
      v-model="dialog"
      title="AI 助教"
      :before-close="handleClose"
      direction="rtl"
      size="45%"
      :show-close="false"
      @open="onOpen"
    >
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass" class="text-bold text-left text-xl text-[#303133]">
          AI助教
        </h4>
        <el-button type="primary" size="small" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          关闭
        </el-button>
      </template>
      <div ref="chatWrapEl" class="ai-assistant__content h-full">
        <ChatPanel
          ref="comRef"
          :loading="loading"
          :data="list"
          :max-height="maxheight"
          :scrollbar="scrollbar"
          :virtual-list-props="{ height: scrollHeight }"
          :page-no="pageNo"
          :page-size="pageSize"
          @reach-top="handleReachTop"
        >
          <template #scroll-loading>
            <a-spin v-if="!isNoMore" :class="{ invisible: !top }" />
          </template>
          <template #no-more>
            <div v-if="isNoMore && !historiesIsEmpty" class="text-gray">
              --没有更多内容了--
            </div>
          </template>
          <template #footer>
            <!-- <a-spin class="invisible" />
            <ChatInput ref="inputBar" :loading="btnLoading" @send="onSendUserMsg" /> -->
            <div class="flex justify-center">
              <Vue3Lottie
                ref="lottieContainerOne"
                animation-link="/assets/sound.json"
                :height="120"
                :width="120"
                :no-margin="true"
                :auto-play="autoPlay"
              />
              <img width="110" height="80" style="object-fit: contain" src="/assets/play.png" alt="audio play btn" @click="debounceOnSwitchAnimation">
              <Vue3Lottie
                ref="lottieContainerTwo"
                animation-link="/assets/sound.json"
                :height="120"
                :width="120"
                :no-margin="true"
                :auto-play="autoPlay"
              />
            </div>
          </template>
          <template #item="{ item, index }">
            <ChatItem :key="index" :item="item!" />
          </template>
        </ChatPanel>
      </div>
    </el-drawer>
  </div>
</template>
