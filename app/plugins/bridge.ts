/* eslint-disable no-new */
export const isQtClient = (function () {
  return navigator.userAgent.includes('QtWebEngine')
})()

export default defineNuxtPlugin(() => {
  if (isQtClient) {
    new window.QWebChannel(window.qt.webChannelTransport, (channel: any) => {
      const myObject = channel.objects.myObject

      return {
        provide: {
          myObject,
        },
      }
    })
  }
})
