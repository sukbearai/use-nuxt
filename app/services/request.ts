import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { axiosMockResponse, axiosRequestAdapter } from '@alova/adapter-axios'
import { createAlovaMockAdapter } from '@alova/mock'
import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import axios from 'axios'
import { RequestEnum, StorageEnum } from '~/constants'
import { getLocalStorage } from '~/utils'
import mocks from './mock'

interface BaseConfig {
  baseUrl: string
  code: string | number
  noContentCode: number
  ENC: boolean// 是否进行加密
}

const baseConfig: BaseConfig = {
  baseUrl: '',
  code: 401, // 登陆过期
  noContentCode: 204, // 请求成功但没有内容
  ENC: false,
}

const netWork = axios.create({
  withCredentials: true, // 跨域携带cookie
})

export const baseUrl = baseConfig.baseUrl
export const CancelToken = axios.CancelToken

export interface Params { [key: string]: string | number }
export interface FileConfig {
  setCancel?: () => void
  onProgress?: () => void
  [key: string]: any
}

netWork.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    // 在发送请求之前做些什么 传token
    const token: any = getLocalStorage(StorageEnum.GB_TOKEN_STORE)
    if (token) {
      config.headers!.common[RequestEnum.GB_TOKEN_KEY] = token
    }
    config.headers!['Content-Type'] = 'application/json;charset=utf-8'

    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

netWork.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    /**
     * @code 登录过期 token验证失败 根据后端调
     */
    if (response.data.code === baseConfig.code) {
      // router.push("/login")
      return Promise.resolve(response.data)
    }
    return Promise.resolve(response.data)
  },
  (error: any) => {
    const err = {
      success: false,
      msg: '未知异常，请联系管理员！',
      code: 400,
    }
    if (JSON.stringify(error).includes('Network Error')) {
      err.msg = '网络错误或服务错误！'
    }
    if (error.message === 'canceled') {
      err.msg = '取消请求'
      err.code = 488
    }
    // console.log(err);
    return Promise.reject(err)
  },
)

// 模拟数据请求适配器
const mockAdapter = createAlovaMockAdapter([mocks], {
  httpAdapter: axiosRequestAdapter({
    axios: netWork,
  }) as any,
  ...axiosMockResponse,
})

// alova instance
export const alovaInst = createAlova({
  statesHook: VueHook,
  requestAdapter: true
    ? mockAdapter
    : axiosRequestAdapter({
      axios: netWork,
    }) as any,
})
