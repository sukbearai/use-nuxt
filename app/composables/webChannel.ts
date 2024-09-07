/* eslint-disable no-new */
import QWebChannel, { isQtClient } from '~/utils/web-channel.js'

interface QtWebSocketOptions {
  onDataUpdated?: (data: any) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: any) => void
}

export function useWebChannel(options: QtWebSocketOptions = {}) {
  const { onDataUpdated } = options

  const qtObject = ref<any>(null)
  // const isConnected = ref(false)

  // const { status: wsStatus, send: wsSend, open, close } = useWebSocket('ws://your-websocket-url', {
  //   autoReconnect: true,
  //   onConnected: () => {
  //     isConnected.value = true
  //     onConnected?.()
  //   },
  //   onDisconnected: () => {
  //     isConnected.value = false
  //     onDisconnected?.()
  //   },
  //   onError,
  // })

  const sendMessageToCpp = (message: any) => {
    if (qtObject.value && typeof qtObject.value.receiveMessage === 'function') {
      qtObject.value.receiveMessage(message)
    }
    else {
      console.error('myObject or receiveMessage function not available')
    }
  }

  const initQtWebChannel = () => {
    if (import.meta.env.DEV || !isQtClient) {
      window.qt = {
        webChannelTransport: {
          send() {
            window.console.log(`
              QWebChannel simulator activated !
            `)
          },

          onmessage: () => {
            window.console.log(`
              QWebChannel simulator activated !
            `)
          },
        },
      }
    }

    new QWebChannel(window.qt.webChannelTransport, (channel: any) => {
      if (channel.objects.myObject) {
        window.console.log('myObject is available')
        qtObject.value = channel.objects.myObject
        qtObject.value.dataUpdated.connect((data: any) => {
          if (data) {
            onDataUpdated?.(data)
          }
          else {
            console.error('data is null')
          }
        })
      }
      else {
        console.error('myObject is not available')
      }
    })
  }

  onMounted(() => {
    initQtWebChannel()
  })

  // onUnmounted(() => {
  //   close()
  // })

  return {
    // isConnected,
    // wsStatus,
    // sendWebSocketMessage: wsSend,
    sendMessageToCpp,
    qtObject,
  }
}
