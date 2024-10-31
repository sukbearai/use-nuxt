import { QTClientSDK } from '~/services/qt.js'

type HeartBeatFlag = 'v' | 's'

// 0: 登录页, 1: 首页
type Route = '0' | '1'

/**
 * Custom composable to handle heartbeat functionality.
 *
 * @param flag - A flag indicating the type of heartbeat. Can be 'v' or 's'.
 * @param route - The current route. Can be '0' for login page or '1' for home page.
 * @returns An object containing the `pause` function to stop the heartbeat.
 *
 * This function initializes the QTClientSDK and sets up an interval to send
 * heartbeat signals every 15 seconds. The heartbeat signal is created using
 * either `createPageSyncDTO_v` or `createPageSyncDTO_s` based on the provided flag.
 * If an error occurs during the heartbeat signal creation, it is logged to the console.
 * The interval is paused when the component is unmounted.
 */
export function useHeartBeat(flag: HeartBeatFlag, route: Route, cb: (data: any) => void) {
  const sdk = new QTClientSDK()

  const createPageSyncDTO = (flag === 'v' ? sdk.createPageSyncDTO_v : sdk.createPageSyncDTO_s).bind(sdk)

  const { pause } = useIntervalFn(() => {
    try {
      const dto = createPageSyncDTO(route)
      cb?.(dto)
    }
    catch (error) {
      console.error(`Error in heartbeat (${flag}):`, error)
    }
  }, 1000)

  onUnmounted(pause)

  return { pause }
}
