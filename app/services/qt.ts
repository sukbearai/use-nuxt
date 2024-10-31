export class QTClientSDK {
  // 定义命令类型
  public static readonly Command = {
    MICROPHONE_CONTROL: '102', // 代表控制的是麦克风设备
    ENTER_STUDY: 'C1', // 代表进入学习
    SIGN_IN: 'C2', // 补充签到
    SIGN_OUT: 'C3', // 签退
    START_STEP: 'C4', // 对步骤进行控制
    PAGE_SYNC: '0', // '0'代表登录页,'1'首页
  } as const

  // 定义命令类型
  public static readonly Type = {
    DEVICE_CONTROL: '0', // 对设备进行控制
    SYSTEM_FUNCTION: '1', // 对系统功能控制
    INFO_SYNC: '2', // 代表同步信息
  } as const

  // 定义页面同步标志枚举
  public static readonly PageSyncFlag = {
    LOGIN: '0',
    HOME: '1',
  } as const

  // 定义麦克风控制枚举
  public static readonly MicrophoneControl = {
    OFF: '0',
    ON: '1',
  } as const

  // 定义通用的DTO生成方法
  private createDTO(comm: typeof QTClientSDK.Command[keyof typeof QTClientSDK.Command] | typeof QTClientSDK.PageSyncFlag[keyof typeof QTClientSDK.PageSyncFlag], type: typeof QTClientSDK.Type[keyof typeof QTClientSDK.Type], additionalProperties?: { [key: string]: string | number }): object {
    const dto = {
      comm,
      type,
    }
    if (additionalProperties) {
      Object.assign(dto, additionalProperties)
    }
    return dto
  }

  // AI助教按键 - 开启或关闭麦克风
  createMicrophoneControlDTO(onOff: typeof QTClientSDK.MicrophoneControl[keyof typeof QTClientSDK.MicrophoneControl]) {
    return this.createDTO(QTClientSDK.Command.MICROPHONE_CONTROL, QTClientSDK.Type.DEVICE_CONTROL, { on_off: onOff })
  }

  // 进入学习模式
  createEnterStudyDTO() {
    return this.createDTO(QTClientSDK.Command.ENTER_STUDY, QTClientSDK.Type.SYSTEM_FUNCTION)
  }

  // 补充签到操作
  createSignInDTO() {
    return this.createDTO(QTClientSDK.Command.SIGN_IN, QTClientSDK.Type.SYSTEM_FUNCTION)
  }

  // 签退操作
  createSignOutDTO() {
    return this.createDTO(QTClientSDK.Command.SIGN_OUT, QTClientSDK.Type.SYSTEM_FUNCTION)
  }

  // 点击步骤
  createClickStepDTO(stepId: string, stepState: string) {
    return this.createDTO(QTClientSDK.Command.START_STEP, QTClientSDK.Type.SYSTEM_FUNCTION, { step_id: stepId, stepState })
  }

  // 同步大屏页面状态
  createPageSyncDTO_v(flag: typeof QTClientSDK.PageSyncFlag[keyof typeof QTClientSDK.PageSyncFlag]) {
    return this.createDTO(flag, QTClientSDK.Type.INFO_SYNC, { screen: 'v' })
  }

  // 同步小屏页面状态
  createPageSyncDTO_s(flag: typeof QTClientSDK.PageSyncFlag[keyof typeof QTClientSDK.PageSyncFlag]) {
    return this.createDTO(flag, QTClientSDK.Type.INFO_SYNC, { screen: 's' })
  }
}
