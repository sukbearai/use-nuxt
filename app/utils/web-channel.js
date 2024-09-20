/* eslint-disable no-prototype-builtins */
/****************************************************************************
**
** Copyright (C) 2016 The Qt Company Ltd.
** Copyright (C) 2016 Klarälvdalens Datakonsult AB, a KDAB Group company, info@kdab.com, author Milian Wolff <milian.wolff@kdab.com>
** Contact: https://www.qt.io/licensing/
**
** This file is part of the QtWebChannel module of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:LGPL$
** Commercial License Usage
** Licensees holding valid commercial Qt licenses may use this file in
** accordance with the commercial license agreement provided with the
** Software or, alternatively, in accordance with the terms contained in
** a written agreement between you and The Qt Company. For licensing terms
** and conditions see https://www.qt.io/terms-conditions. For further
** information use the contact form at https://www.qt.io/contact-us.
**
** GNU Lesser General Public License Usage
** Alternatively, this file may be used under the terms of the GNU Lesser
** General Public License version 3 as published by the Free Software
** Foundation and appearing in the file LICENSE.LGPL3 included in the
** packaging of this file. Please review the following information to
** ensure the GNU Lesser General Public License version 3 requirements
** will be met: https://www.gnu.org/licenses/lgpl-3.0.html.
**
** GNU General Public License Usage
** Alternatively, this file may be used under the terms of the GNU
** General Public License version 2.0 or (at your option) the GNU General
** Public license version 3 or any later version approved by the KDE Free
** Qt Foundation. The licenses are as published by the Free Software
** Foundation and appearing in the file LICENSE.GPL2 and LICENSE.GPL3
** included in the packaging of this file. Please review the following
** information to ensure the GNU General Public License requirements will
** be met: https://www.gnu.org/licenses/gpl-2.0.html and
** https://www.gnu.org/licenses/gpl-3.0.html.
**
** $QT_END_LICENSE$
**
****************************************************************************/

'use strict'

const QWebChannelMessageTypes = {
  signal: 1,
  propertyUpdate: 2,
  init: 3,
  idle: 4,
  debug: 5,
  invokeMethod: 6,
  connectToSignal: 7,
  disconnectFromSignal: 8,
  setProperty: 9,
  response: 10,
}

const QWebChannel = function (transport, initCallback) {
  if (typeof transport !== 'object' || typeof transport.send !== 'function') {
    console.error(`The QWebChannel expects a transport object with a send function and onmessage callback property.`
      + ` Given is: transport: ${typeof (transport)}, transport.send: ${typeof (transport.send)}`)
    return
  }

  const channel = this
  this.transport = transport

  this.send = function (data) {
    if (typeof (data) !== 'string') {
      data = JSON.stringify(data)
    }
    channel.transport.send(data)
  }

  this.transport.onmessage = function (message) {
    let data = message.data
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }
    switch (data.type) {
      case QWebChannelMessageTypes.signal:
        channel.handleSignal(data)
        break
      case QWebChannelMessageTypes.response:
        channel.handleResponse(data)
        break
      case QWebChannelMessageTypes.propertyUpdate:
        channel.handlePropertyUpdate(data)
        break
      default:
        console.error('invalid message received:', message.data)
        break
    }
  }

  this.execCallbacks = {}
  this.execId = 0
  this.exec = function (data, callback) {
    if (!callback) {
      // if no callback is given, send directly
      channel.send(data)
      return
    }
    if (channel.execId === Number.MAX_VALUE) {
      // wrap
      channel.execId = Number.MIN_VALUE
    }
    if (data.hasOwnProperty('id')) {
      console.error(`Cannot exec message with property id: ${JSON.stringify(data)}`)
      return
    }
    data.id = channel.execId++
    channel.execCallbacks[data.id] = callback
    channel.send(data)
  }

  this.objects = {}

  this.handleSignal = function (message) {
    const object = channel.objects[message.object]
    if (object) {
      object.signalEmitted(message.signal, message.args)
    }
    else {
      console.warn(`Unhandled signal: ${message.object}::${message.signal}`)
    }
  }

  this.handleResponse = function (message) {
    if (!message.hasOwnProperty('id')) {
      console.error('Invalid response message received: ', JSON.stringify(message))
      return
    }
    channel.execCallbacks[message.id](message.data)
    delete channel.execCallbacks[message.id]
  }

  this.handlePropertyUpdate = function (message) {
    for (const i in message.data) {
      const data = message.data[i]
      const object = channel.objects[data.object]
      if (object) {
        object.propertyUpdate(data.signals, data.properties)
      }
      else {
        console.warn(`Unhandled property update: ${data.object}::${data.signal}`)
      }
    }
    channel.exec({ type: QWebChannelMessageTypes.idle })
  }

  this.debug = function (message) {
    channel.send({ type: QWebChannelMessageTypes.debug, data: message })
  }

  channel.exec({ type: QWebChannelMessageTypes.init }, (data) => {
    for (const objectName in data) {
      // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
      const object = new QObject(objectName, data[objectName], channel)
    }
    // now unwrap properties, which might reference other registered objects
    for (const objectName in channel.objects) {
      channel.objects[objectName].unwrapProperties()
    }
    if (initCallback) {
      initCallback(channel)
    }
    channel.exec({ type: QWebChannelMessageTypes.idle })
  })
}

function QObject(name, data, webChannel) {
  this.__id__ = name
  webChannel.objects[name] = this

  // List of callbacks that get invoked upon signal emission
  this.__objectSignals__ = {}

  // Cache of all properties, updated when a notify signal is emitted
  this.__propertyCache__ = {}

  const object = this

  // ----------------------------------------------------------------------

  this.unwrapQObject = function (response) {
    if (Array.isArray(response)) {
      // support list of objects
      const ret = Array.from({ length: response.length })
      for (let i = 0; i < response.length; ++i) {
        ret[i] = object.unwrapQObject(response[i])
      }
      return ret
    }
    if (!response
      || !response['__QObject*__']
      || response.id === undefined) {
      return response
    }

    const objectId = response.id
    if (webChannel.objects[objectId])
      return webChannel.objects[objectId]

    if (!response.data) {
      console.error(`Cannot unwrap unknown QObject ${objectId} without data.`)
      return
    }

    const qObject = new QObject(objectId, response.data, webChannel)
    qObject.destroyed.connect(() => {
      if (webChannel.objects[objectId] === qObject) {
        delete webChannel.objects[objectId]
        // reset the now deleted QObject to an empty {} object
        // just assigning {} though would not have the desired effect, but the
        // below also ensures all external references will see the empty map
        // NOTE: this detour is necessary to workaround QTBUG-40021
        const propertyNames = []
        for (const propertyName in qObject) {
          propertyNames.push(propertyName)
        }
        for (const idx in propertyNames) {
          delete qObject[propertyNames[idx]]
        }
      }
    })
    // here we are already initialized, and thus must directly unwrap the properties
    qObject.unwrapProperties()
    return qObject
  }

  this.unwrapProperties = function () {
    for (const propertyIdx in object.__propertyCache__) {
      object.__propertyCache__[propertyIdx] = object.unwrapQObject(object.__propertyCache__[propertyIdx])
    }
  }

  function addSignal(signalData, isPropertyNotifySignal) {
    const signalName = signalData[0]
    const signalIndex = signalData[1]
    object[signalName] = {
      connect(callback) {
        if (typeof (callback) !== 'function') {
          console.error(`Bad callback given to connect to signal ${signalName}`)
          return
        }

        object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || []
        object.__objectSignals__[signalIndex].push(callback)

        if (!isPropertyNotifySignal && signalName !== 'destroyed') {
          // only required for "pure" signals, handled separately for properties in propertyUpdate
          // also note that we always get notified about the destroyed signal
          webChannel.exec({
            type: QWebChannelMessageTypes.connectToSignal,
            object: object.__id__,
            signal: signalIndex,
          })
        }
      },
      disconnect(callback) {
        if (typeof (callback) !== 'function') {
          console.error(`Bad callback given to disconnect from signal ${signalName}`)
          return
        }
        object.__objectSignals__[signalIndex] = object.__objectSignals__[signalIndex] || []
        const idx = object.__objectSignals__[signalIndex].indexOf(callback)
        if (idx === -1) {
          console.error(`Cannot find connection of signal ${signalName} to ${callback.name}`)
          return
        }
        object.__objectSignals__[signalIndex].splice(idx, 1)
        if (!isPropertyNotifySignal && object.__objectSignals__[signalIndex].length === 0) {
          // only required for "pure" signals, handled separately for properties in propertyUpdate
          webChannel.exec({
            type: QWebChannelMessageTypes.disconnectFromSignal,
            object: object.__id__,
            signal: signalIndex,
          })
        }
      },
    }
  }

  /**
   * Invokes all callbacks for the given signalname. Also works for property notify callbacks.
   */
  function invokeSignalCallbacks(signalName, signalArgs) {
    const connections = object.__objectSignals__[signalName]
    if (connections) {
      connections.forEach((callback) => {
        callback.apply(callback, signalArgs)
      })
    }
  }

  this.propertyUpdate = function (signals, propertyMap) {
    // update property cache
    for (const propertyIndex in propertyMap) {
      const propertyValue = propertyMap[propertyIndex]
      object.__propertyCache__[propertyIndex] = propertyValue
    }

    for (const signalName in signals) {
      // Invoke all callbacks, as signalEmitted() does not. This ensures the
      // property cache is updated before the callbacks are invoked.
      invokeSignalCallbacks(signalName, signals[signalName])
    }
  }

  this.signalEmitted = function (signalName, signalArgs) {
    invokeSignalCallbacks(signalName, this.unwrapQObject(signalArgs))
  }

  function addMethod(methodData) {
    const methodName = methodData[0]
    const methodIdx = methodData[1]
    object[methodName] = function () {
      const args = []
      let callback
      for (let i = 0; i < arguments.length; ++i) {
        // eslint-disable-next-line prefer-rest-params
        const argument = arguments[i]
        if (typeof argument === 'function') {
          callback = argument
        }
        else if (argument instanceof QObject && webChannel.objects[argument.__id__] !== undefined) {
          args.push({
            id: argument.__id__,
          })
        }
        else {
          args.push(argument)
        }
      }

      webChannel.exec({
        type: QWebChannelMessageTypes.invokeMethod,
        object: object.__id__,
        method: methodIdx,
        args,
      }, (response) => {
        if (response !== undefined) {
          const result = object.unwrapQObject(response)
          if (callback) {
            (callback)(result)
          }
        }
      })
    }
  }

  function bindGetterSetter(propertyInfo) {
    const propertyIndex = propertyInfo[0]
    const propertyName = propertyInfo[1]
    const notifySignalData = propertyInfo[2]
    // initialize property cache with current value
    // NOTE: if this is an object, it is not directly unwrapped as it might
    // reference other QObject that we do not know yet
    object.__propertyCache__[propertyIndex] = propertyInfo[3]

    if (notifySignalData) {
      if (notifySignalData[0] === 1) {
        // signal name is optimized away, reconstruct the actual name
        notifySignalData[0] = `${propertyName}Changed`
      }
      addSignal(notifySignalData, true)
    }

    Object.defineProperty(object, propertyName, {
      configurable: true,
      get() {
        const propertyValue = object.__propertyCache__[propertyIndex]
        if (propertyValue === undefined) {
          // This shouldn't happen
          console.warn(`Undefined value in property cache for property "${propertyName}" in object ${object.__id__}`)
        }

        return propertyValue
      },
      set(value) {
        if (value === undefined) {
          console.warn(`Property setter for ${propertyName} called with undefined value!`)
          return
        }
        object.__propertyCache__[propertyIndex] = value
        let valueToSend = value
        if (valueToSend instanceof QObject && webChannel.objects[valueToSend.__id__] !== undefined)
          valueToSend = { id: valueToSend.__id__ }
        webChannel.exec({
          type: QWebChannelMessageTypes.setProperty,
          object: object.__id__,
          property: propertyIndex,
          value: valueToSend,
        })
      },
    })
  }

  // ----------------------------------------------------------------------

  data.methods.forEach(addMethod)

  data.properties.forEach(bindGetterSetter)

  data.signals.forEach((signal) => {
    addSignal(signal, false)
  })

  for (const name in data.enums) {
    object[name] = data.enums[name]
  }
}

// required for use with nodejs
// if (typeof module === 'object') {
//   module.exports = {
//     QWebChannel,
//   }
// }

export default QWebChannel

export const isQtClient = (function () {
  return navigator.userAgent.includes('QtWebEngine')
})()
