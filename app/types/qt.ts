export enum DataType {
  TASK_INFO = '3',
  VIDEO_FRAME = '101',
  AI_ASSISTANT = '102',
  SIGN_IN = '111',
}

export enum CameraId {
  FACE = '0',
  PTZ = '1',
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

export interface QTResponseType {
  type: string
  cam_id?: string
  img?: string
  payload?: any
  ret?: string
  state?: string
  text?: string
  line1?: string
  line2?: string
  line3?: string
  err?: string
}
