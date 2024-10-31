/* eslint-disable no-new */
import type { QTResponseType } from '~/types/qt'
import QWebChannel, { isQtClient } from '~/utils/web-channel.js'

interface QtWebSocketOptions {
  onDataUpdated?: (data: QTResponseType) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: any) => void
}

type CallbackId = string
type Callback<T = unknown> = (data: QTResponseType<T>) => void

let cacheQtObject: any = null
const globalCallbackMap = new Map<CallbackId, Callback>()

export function useWebChannel(options: QtWebSocketOptions = {}) {
  const qtObject = ref<any>(null)

  const sendMessageToCpp = (message: any) => {
    qtObject.value = cacheQtObject

    if (qtObject.value && typeof qtObject.value.receiveMessage === 'function') {
      qtObject.value.receiveMessage(message)
    }
    else {
      console.error('myObject or receiveMessage function not available')
    }
  }

  const connect = <T = unknown>(callback: Callback<T>): CallbackId => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2)}`
    globalCallbackMap.set(id, callback as Callback<any>)
    return id
  }

  const disconnect = (id: CallbackId): boolean => {
    return globalCallbackMap.delete(id)
  }

  const handleDataUpdated = (data: QTResponseType) => {
    window.console.log('DEBUG:未处理的QT原始消息', data)
    if (data) {
      globalCallbackMap.forEach((cb) => {
        cb(data)
      })
    }
    else {
      console.error('data is null')
    }
  }

  const initQtWebChannel = () => {
    if (import.meta.env.DEV || !isQtClient) {
      window.qt = {
        webChannelTransport: {
          send() {
            window.console.log('QWebChannel simulator activated !')
          },
          onmessage: () => {
            window.console.log('QWebChannel simulator activated !')
          },
        },
      }
    }

    new QWebChannel(window.qt.webChannelTransport, (channel: any) => {
      if (channel.objects.myObject) {
        window.console.log('myObject is available')
        qtObject.value = channel.objects.myObject
        cacheQtObject = channel.objects.myObject

        if (typeof qtObject.value.dataUpdated?.connect === 'function') {
          qtObject.value.dataUpdated.connect(handleDataUpdated)
        }
        else {
          console.error('myObject dataUpdated connect function not available')
        }
      }
      else {
        console.error('myObject is not available')
      }
    })
  }

  onMounted(() => {
    if (!cacheQtObject) {
      initQtWebChannel()
    }
    else {
      qtObject.value = cacheQtObject
      // if (typeof qtObject.value.dataUpdated?.connect === 'function') {
      //   qtObject.value.dataUpdated.connect(handleDataUpdated)
      // }
    }
  })

  // Watch for changes in the options.onDataUpdated callback
  watch(() => options.onDataUpdated, (newCallback) => {
    if (newCallback) {
      connect(newCallback)
    }
  }, { immediate: true })

  return {
    sendMessageToCpp,
    connect,
    disconnect,
    qtObject,
  }
}
