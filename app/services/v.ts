import { alovaInst } from './request'

const urlMap = {
  leftTop: '/v/countDeviceNum',
  leftCenter: '/v/countUserNum',
  centerMap: '/v/centerMap',
  centerBottom: '/v/installationPlan',
  leftBottom: '/v/leftBottom',
  rightTop: '/v/alarmNum',
  rightBottom: '/v/rightBottom',
  rightCenter: '/v/ranking',
}

/** 左上--设备内总览 */
export function countDeviceNum(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.leftTop, {
    params,
  })
}

/** 左中--用户总览 */
export function countUserNum(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.leftCenter, {
    params,
  })
}

/** 左下--设备提醒 */
export function leftBottom(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.leftBottom, {
    params,
  })
}

/** 中上--地图 */
export function centerMap(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.centerMap, {
    params,
  })
}

/** 中下--安装计划 */
export function installationPlan(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.centerBottom, {
    params,
  })
}

/** 右上--报警次数 */
export function alarmNum(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.rightTop, {
    params,
  })
}

/** 右中--报警排名 */
export function ranking(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.rightCenter, {
    params,
  })
}

/** 右下--设备状态 */
export function rightBottom(params: Record<string, any> = {}) {
  return alovaInst.Get(urlMap.rightBottom, {
    params,
  })
}

export function getMapData(url: string, params: Record<string, any> = {}) {
  return alovaInst.Get(url, {
    params,
  })
}
