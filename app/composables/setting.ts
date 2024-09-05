import { acceptHMRUpdate, defineStore } from 'pinia'

interface SettingConfig {
  leftBottomSwiper: boolean
  rightBottomSwiper: boolean
}

interface DefaultOption {
  step: number
  hover: boolean
  wheel: boolean
  openWatch: boolean
  direction: number
  limitScrollNum: number
  singleHeight: number
  singleWidth: number
  singleWaitTime: number
}

interface SettingState {
  settingShow: boolean
  isScale: boolean
  indexConfig: SettingConfig
  defaultOption: DefaultOption
}

export const useSettingStore = defineStore('setting', () => {
  const state = ref<SettingState>({
    settingShow: false, // 设置弹窗显隐
    isScale: true, // 是否进行全局适配
    indexConfig: {
      leftBottomSwiper: true, // 左轮播
      rightBottomSwiper: true, // 右下轮播
    },
    defaultOption: {
      step: 4, // 数值越大速度滚动越快
      hover: true, // 是否开启鼠标悬停stop
      wheel: false, // 在开启鼠标悬停的情况下是否开启滚轮滚动，默认不开启
      openWatch: true, // 开启数据实时监控刷新dom
      direction: 1, // 0向下 1向上 2向左 3向右
      limitScrollNum: 4, // 开始无缝滚动的数据量 this.dataList.length
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      singleWaitTime: 3000, // 单步运动停止的时间(默认值1000ms)
    },
  })

  const setSettingData = () => {
    localStorage.setItem('loftv-settingData', JSON.stringify({
      isScale: state.value.isScale,
    }))
  }

  const setSettingShow = (flag: boolean) => {
    state.value.settingShow = flag
  }

  const setIsScale = (flag: boolean) => {
    state.value.isScale = flag
    setSettingData()
  }

  const setIndexConfig = (Config: any) => {
    state.value.indexConfig = Config
    localStorage.setItem('loftv-indexConfig', JSON.stringify(state.value.indexConfig))
  }

  const initSetting = () => {
    let settingData: any = localStorage.getItem('loftv-settingData')
    if (settingData) {
      settingData = JSON.parse(settingData)
      setIsScale(settingData.isScale)
    }
    let settingIndexConfig: any = localStorage.getItem('loftv-indexConfig')
    if (settingIndexConfig) {
      settingIndexConfig = JSON.parse(settingIndexConfig)
      setIndexConfig(settingIndexConfig)
    }
  }

  return {
    ...toRefs(state.value),
    setSettingShow,
    setIsScale,
    initSetting,
    setSettingData,
    setIndexConfig,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
