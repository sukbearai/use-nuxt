import Mock from 'mockjs'
import { defineMock } from '@alova/mock'
import { RandomNumBoth, genArr, parseParamUrl } from '~/utils'

const mocks = defineMock({
  '/v/countUserNum': () => {
    const a = Mock.mock({
      success: true,
      data: {
        offlineNum: '@integer(50, 100)',
        alarmNum: '@integer(20, 100)',
        lockNum: '@integer(10, 50)',
        totalNum: 368,
      },
    })
    a.data.onlineNum = a.data.totalNum - a.data.offlineNum - a.data.lockNum - a.data.alarmNum
    return a
  },

  '/v/countDeviceNum': () => {
    const a = Mock.mock({
      success: true,
      data: {
        alarmNum: '@integer(100, 1000)',
        offlineNum: '@integer(0, 50)',
        totalNum: 698,
      },
    })
    a.data.onlineNum = a.data.totalNum - a.data.offlineNum
    return a
  },

  '/v/leftBottom': () => {
    const a = Mock.mock({
      success: true,
      data: {
        'list|20': [
          {
            'provinceName': '@province()',
            'cityName': '@city()',
            'countyName': '@county()',
            'createTime': '@datetime(\'yyyy-MM-dd HH:mm:ss\')',
            'deviceId': '6c512d754bbcd6d7cd86abce0e0cac58',
            'gatewayno|+1': 10000,
            'onlineState|1': [0, 1],

          },
        ],
      },
    })
    return a
  },

  '/v/alarmNum': () => {
    const a = Mock.mock({
      success: true,
      data: {
        'dateList': ['2021-11', '2021-12', '2022-01', '2022-02', '2022-03', '2022-04'],
        'numList|6': [
          '@integer(0, 1000)',
        ],
        'numList2|6': [
          '@integer(0, 1000)',
        ],
      },
    })
    return a
  },

  '/v/ranking': () => {
    const num = Mock.mock({ 'list|80': [{ value: '@integer(50,1000)', name: '@city()' }] }).list
    //   console.log("ranking",num);
    const newNum: any = []
    const numObj: any = {}
    num.forEach((item: any) => {
      if (!numObj[item.name] && newNum.length < 8) {
        numObj[item.name] = true
        newNum.push(item)
      }
    })
    const arr = newNum.sort((a: any, b: any) => {
      return b.value - a.value
    })
    const a = {
      success: true,
      data: arr,
    }
    return a
  },

  '/v/rightBottom': () => {
    const a = Mock.mock({
      success: true,
      data: {
        'list|40': [{
          'alertdetail': '@csentence(5,10)',
          'alertname|1': ['水浸告警', '各种报警'],
          'alertvalue': '@float(60, 200)',
          'createtime': '2022-04-19 08:38:33',
          'deviceid': null,
          'gatewayno|+1': 10000,
          'phase': 'A1',
          'sbInfo': '@csentence(10,18)',
          'terminalno|+1': 100,
          'provinceName': '@province()',
          'cityName': '@city()',
          'countyName': '@county()',
        }],

      },
    })
    return a
  },

  '/v/installationPlan': () => {
    const num = RandomNumBoth(26, 32)
    const a = Mock.mock({
      [`category|${num}`]: ['@city()'],
      [`barData|${num}`]: ['@integer(10, 100)'],
    })
    const lineData = []
    const rateData = []
    for (let index = 0; index < num; index++) {
      const lineNum = Mock.mock('@integer(0, 100)') + a.barData[index]
      lineData.push(lineNum)
      const rate = a.barData[index] / lineNum
      rateData.push((rate * 100).toFixed(0))
    }
    a.lineData = lineData
    a.rateData = rateData
    return {
      success: true,
      data: a,
    }
  },

  '/v/centerMap': (options: any) => {
    const params = parseParamUrl(options.url)
    if (params.regionCode && !['china'].includes(params.regionCode)) {
      const a = Mock.mock({
        success: true,
        data: {
          'dataList|100': [
            {
              name: '@city()',
              value: '@integer(1, 1000)',
            },
          ],
          'regionCode': params.regionCode,
        },
      })
      return a
    }
    else {
      const a = Mock.mock({
        success: true,
        data: {
          'dataList|12': [
            {
              name: '@province()',
              value: '@integer(1, 1100)',
            },
          ],
          'regionCode': 'china',
        },
      })
      // 去重
      a.data.dataList = genArr(a.data.dataList, 'name')
      return a
    }
  },
})

export default mocks
