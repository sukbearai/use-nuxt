<script setup lang="js">
// ライブラリの読み込み
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display'
import { DataType, ReturnCode } from '~/types/qt'

// mock数据
const { playTalkAct, initializeData, startDynamicUpdate } = useDynamicMockData()
initializeData()
startDynamicUpdate()

window.PIXI = PIXI
const canvasRef = ref(null)
let animationFrame = null
const model = ref()

const { connect, disconnect } = useWebChannel()

const cbId = connect((data) => {
  // QT控制模型说话
  if (data.type === DataType.AI_ASSISTANT) {
    switch (data.ret) {
      case ReturnCode.RECORDING_STATUS:
        playTalkAct.value = false
        break
      case ReturnCode.AI_TALK:
        playTalkAct.value = true
        break
      default:
        console.warn(`Unknown return code: ${data.ret}`)
    }
  }
})

onBeforeUnmount(() => {
  disconnect(cbId)
})

watch(playTalkAct, (val) => {
  if (val) {
    run()
  }
  else {
    stop()
  }
})

onMounted(async () => {
  // PIXI.Applicationのインスタンスを生成
  const app = new PIXI.Application({
    width: 350,
    height: 400,
    transparent: true,
    view: document.getElementById('2d'), // canvas要素を指定
  })

  // モデルの読み込み
  model.value = await Live2DModel.from('/Resources/Natori/Natori.model3.json')

  // pixijsのviewにモデルを描画する
  app.stage.addChild(model.value)

  // モデルの表示位置や表示場所などを設定(この辺はモデルに合わせて調整してください)
  model.value.x = -200
  model.value.y = -86
  model.value.scale.set(0.18, 0.18) // モデルの縮尺
  model.value.anchor.set(0, 0) // 表示の基準の位置

  run()
})

function setMouthOpenY(v) {
  v = Math.max(0, Math.min(1, v))
  model.value.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', v)
}

function run() {
  if (!playTalkAct.value) {
    return
  }

  // 模拟音频唇形同步
  const randomValue = Math.random()
  setMouthOpenY(randomValue)
  // 使用 setTimeout 来控制更新频率，这里设置为每秒30次（1000/30 ≈ 33.33ms）
  animationFrame = setTimeout(run, 1000 / 30)
}

function stop() {
  if (!model.value) {
    return
  }

  model.value.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 0)
}

onUnmounted(() => {
  if (animationFrame) {
    clearTimeout(animationFrame)
  }
})
</script>

<template>
  <canvas id="2d" ref="canvasRef" />
</template>
