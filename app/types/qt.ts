export interface Course {
  taskId: string
  taskCode: string
  taskName: string
  content: string
  stepList: Step[]
}

export interface Step {
  stepId: string
  stepCode: string
  stepState: Step_State // 任务的状态 0未开始 1正在做 2已完成
  description: string
  ai_state: string // 0 未打分，1 已打分
  ai_score: string
  ai_comment: string
}

export interface UserInfo {
  name: string
  stu_id: string
  state: string // 1签到 0未签到
  avatar: string
}

export enum Step_State {
  NOT_STARTED = '0',
  DOING = '1',
  COMPLETED = '2',
}

export enum PAGE_SYNC {
  LOGIN = '0',
  HOME = '1',
}

export enum PAGE_SIGN {
  BIG_SCREEN = 'v',
  SMALL_SCREEN = 's',
}

export enum DataType {
  PAGE_JUMP = '2',
  TASK_INFO = '3',
  VIDEO_FRAME = '101',
  AI_ASSISTANT = '102',
  SIGN_IN = '111',
}

export enum CameraId {
  FACE = '0', // 人脸
  PTZ = '1', // 球机
  TRACK = '2', // 轨迹
}

export enum ReturnCode {
  RECORDING_STATUS = '0',
  VOICE_TO_TEXT = '1',
  AI_INFERENCE = '2',
}

export enum State {
  RECORDING = '2',
  COMPLETED = '3',
}

export interface QTResponseType<T = unknown> {
  type: string
  cam_id?: string
  img?: string
  payload?: T
  ret?: string
  state?: string
  text?: string
  line1?: string
  line2?: string
  line3?: string
  err?: string
  index?: PAGE_SYNC
  screen?: PAGE_SIGN
  stage_name?: string
  task_len?: string
  video_url?: string
}
