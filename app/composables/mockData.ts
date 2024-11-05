import { ref } from 'vue'

interface ChatItem {
  id: string
  answer: boolean
  valueContent: string
}

interface EvaluateItem {
  taskName: string
  description: string
  comment: string
  score: string
}

// 基础聊天内容模板
const chatTemplates = [
  {
    answer: true,
    valueContent: '代码review过程中发现一些可以优化的点，建议重构数据处理逻辑以提升性能。',
  },
  {
    answer: false,
    valueContent: '这个功能的实现方式可能需要重新考虑，目前的方案可能会在高并发情况下出现问题。',
  },
  {
    answer: true,
    valueContent: '新增的单元测试覆盖了大部分边界情况，这对提高代码质量很有帮助。',
  },
  {
    answer: true,
    valueContent: '使用异步组件加载确实改善了首屏加载时间，用户体验有明显提升。',
  },
]

// 基础评价内容模板
const evaluateTemplates = [
  {
    taskName: 'React性能优化实战',
    description: '实现虚拟列表组件',
    comment: '很好地处理了滚动性能问题，建议添加动态高度支持。',
    score: '93',
  },
  {
    taskName: '微服务架构设计',
    description: '实现服务注册与发现',
    comment: '服务健康检查机制完善，建议增加熔断降级策略。',
    score: '91',
  },
  {
    taskName: '前端工程化实践',
    description: '构建CI/CD流水线',
    comment: '自动化测试覆盖率高，建议添加性能测试环节。',
    score: '94',
  },
  {
    taskName: '数据可视化开发',
    description: '实现实时数据大屏',
    comment: '图表展现形式丰富，建议优化大数据量渲染性能。',
    score: '89',
  },
]

// 任务列表模板
const taskTemplates = [
  {
    taskId: '任务id1',
    taskCode: '1',
    taskName: 'X轴正反转控制',
    content: '驱动X轴以给定速度30进行正转、反转',
    stepList: [
      {
        stepId: '步骤id1',
        note: '注意事项1',
        ai_state: '0',
        ai_score: '90',
        ai_comment: '步骤表现良好',
        stepCode: '1',
        stepState: '1',
        description: '驱动X轴以给定速度30进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id2',
    taskCode: '2',
    taskName: 'Y轴正反转控制',
    content: '驱动Y轴以给定速度40进行正转、反转',
    stepList: [
      {
        stepId: '步骤id2',
        note: '注意事项2',
        ai_state: '0',
        ai_score: '0',
        ai_comment: '未评分',
        stepCode: '1',
        stepState: '0',
        description: '驱动Y轴以给定速度40进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id3',
    taskCode: '3',
    taskName: 'Z轴正反转控制',
    content: '驱动Z轴以给定速度50进行正转、反转',
    stepList: [
      {
        stepId: '步骤id3',
        note: '注意事项3',
        ai_state: '0',
        ai_score: '85',
        ai_comment: '表现中等',
        stepCode: '1',
        stepState: '0',
        description: '驱动Z轴以给定速度50进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id4',
    taskCode: '4',
    taskName: 'A轴正反转控制',
    content: '驱动A轴以给定速度20进行正转、反转',
    stepList: [
      {
        stepId: '步骤id4',
        note: '注意事项4',
        ai_state: '0',
        ai_score: '95',
        ai_comment: '表现优异',
        stepCode: '1',
        stepState: '0',
        description: '驱动A轴以给定速度20进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id5',
    taskCode: '5',
    taskName: 'B轴正反转控制',
    content: '驱动B轴以给定速度25进行正转、反转',
    stepList: [
      {
        stepId: '步骤id5',
        note: '注意事项5',
        ai_state: '0',
        ai_score: '0',
        ai_comment: '未评分',
        stepCode: '1',
        stepState: '0',
        description: '驱动B轴以给定速度25进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id6',
    taskCode: '6',
    taskName: 'C轴正反转控制',
    content: '驱动C轴以给定速度60进行正转、反转',
    stepList: [
      {
        stepId: '步骤id6',
        note: '注意事项6',
        ai_state: '0',
        ai_score: '78',
        ai_comment: '表现一般',
        stepCode: '1',
        stepState: '0',
        description: '驱动C轴以给定速度60进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id7',
    taskCode: '7',
    taskName: 'D轴正反转控制',
    content: '驱动D轴以给定速度35进行正转、反转',
    stepList: [
      {
        stepId: '步骤id7',
        note: '注意事项7',
        ai_state: '0',
        ai_score: '88',
        ai_comment: '步骤良好',
        stepCode: '1',
        stepState: '0',
        description: '驱动D轴以给定速度35进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id8',
    taskCode: '8',
    taskName: 'E轴正反转控制',
    content: '驱动E轴以给定速度45进行正转、反转',
    stepList: [
      {
        stepId: '步骤id8',
        note: '注意事项8',
        ai_state: '0',
        ai_score: '0',
        ai_comment: '未评分',
        stepCode: '1',
        stepState: '0',
        description: '驱动E轴以给定速度45进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id9',
    taskCode: '9',
    taskName: 'F轴正反转控制',
    content: '驱动F轴以给定速度55进行正转、反转',
    stepList: [
      {
        stepId: '步骤id9',
        note: '注意事项9',
        ai_state: '0',
        ai_score: '82',
        ai_comment: '步骤执行正常',
        stepCode: '1',
        stepState: '0',
        description: '驱动F轴以给定速度55进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id10',
    taskCode: '10',
    taskName: 'G轴正反转控制',
    content: '驱动G轴以给定速度70进行正转、反转',
    stepList: [
      {
        stepId: '步骤id10',
        note: '注意事项10',
        ai_state: '0',
        ai_score: '0',
        ai_comment: '未评分',
        stepCode: '1',
        stepState: '0',
        description: '驱动G轴以给定速度70进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id11',
    taskCode: '11',
    taskName: 'H轴正反转控制',
    content: '驱动H轴以给定速度80进行正转、反转',
    stepList: [
      {
        stepId: '步骤id11',
        note: '注意事项11',
        ai_state: '0',
        ai_score: '91',
        ai_comment: '优秀表现',
        stepCode: '1',
        stepState: '0',
        description: '驱动H轴以给定速度80进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id12',
    taskCode: '12',
    taskName: 'I轴正反转控制',
    content: '驱动I轴以给定速度90进行正转、反转',
    stepList: [
      {
        stepId: '步骤id12',
        note: '注意事项12',
        ai_state: '0',
        ai_score: '87',
        ai_comment: '步骤良好',
        stepCode: '1',
        stepState: '0',
        description: '驱动I轴以给定速度90进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id13',
    taskCode: '13',
    taskName: 'J轴正反转控制',
    content: '驱动J轴以给定速度95进行正转、反转',
    stepList: [
      {
        stepId: '步骤id13',
        note: '注意事项13',
        ai_state: '0',
        ai_score: '0',
        ai_comment: '未评分',
        stepCode: '1',
        stepState: '0',
        description: '驱动J轴以给定速度95进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id14',
    taskCode: '14',
    taskName: 'K轴正反转控制',
    content: '驱动K轴以给定速度100进行正转、反转',
    stepList: [
      {
        stepId: '步骤id14',
        note: '注意事项14',
        ai_state: '0',
        ai_score: '92',
        ai_comment: '步骤执行优秀',
        stepCode: '1',
        stepState: '0',
        description: '驱动K轴以给定速度100进行正转、反转（100）',
      },
    ],
  },
  {
    taskId: '任务id15',
    taskCode: '15',
    taskName: 'L轴正反转控制',
    content: '驱动L轴以给定速度110进行正转、反转',
    stepList: [
      {
        stepId: '步骤id15',
        note: '注意事项15',
        ai_state: '0',
        ai_score: '89',
        ai_comment: '良好表现',
        stepCode: '1',
        stepState: '0',
        description: '驱动L轴以给定速度110进行正转、反转（100）',
      },
    ],
  },
]

// 创建动态更新的数据源
export function useDynamicMockData() {
  const chatList = ref<ChatItem[]>([])
  const evaluateList = ref<EvaluateItem[]>([])
  const taskList = ref<typeof taskTemplates>([])
  let chatCounter = 0
  let timer: NodeJS.Timeout | null = null
  let taskIndex = 0
  const env1 = ref(50)
  const env2 = ref(75)
  const playTalkAct = ref(false)

  // 结束口播动画
  const stopDynamicTalkAnimation = (ms: number) => {
    setTimeout(() => {
      playTalkAct.value = false
    }, Math.max(3000, ms))
  }

  // 生成新的聊天内容
  const generateNewChat = () => {
    const template = chatTemplates[Math.floor(Math.random() * chatTemplates.length)]!

    stopDynamicTalkAnimation(template.valueContent.length * 100)

    return {
      ...template,
      id: `mock${Date.now()}${chatCounter++}`,
    }
  }

  // 生成新的评价内容
  const generateNewEvaluate = () => {
    const template = evaluateTemplates[Math.floor(Math.random() * evaluateTemplates.length)]!
    return {
      ...template,
      // 随机调整分数，保持在85-95之间
      score: (85 + Math.floor(Math.random() * 10)).toString(),
    }
  }

  // 初始化数据
  const initializeData = () => {
    // 初始添加5条聊天记录
    for (let i = 0; i < 5; i++) {
      chatList.value.push(generateNewChat())
    }

    // 初始添加3条评价记录
    for (let i = 0; i < 3; i++) {
      evaluateList.value.push(generateNewEvaluate())
    }

    taskList.value = taskTemplates
  }

  // 启动定时更新
  const startDynamicUpdate = () => {
    // 每5秒更新一次数据
    if (timer)
      clearInterval(timer)
    timer = setInterval(() => {
      // 口播动画
      playTalkAct.value = true

      // 动态更新任务列表状态
      const currentTask = taskList.value[taskIndex]
      if (currentTask && currentTask.stepList[0]) {
        const step = currentTask.stepList[0]
        // 创建新的对象来更新，确保响应式
        step.stepState = '1'
      }

      // 动态更新环境
      env1.value = Math.floor(Math.random() * (80 - 50 + 1)) + 50
      env2.value = Math.floor(Math.random() * (100 - 75 + 1)) + 75

      taskIndex = (taskIndex + 1) % taskList.value.length // 更新索引，循环遍历任务

      // 添加新的聊天记录
      chatList.value.push(generateNewChat())
      // 限制最多显示20条聊天记录
      if (chatList.value.length > 20) {
        chatList.value.shift()
      }

      // 添加新的评价记录
    //   evaluateList.value.push(generateNewEvaluate())
      // 限制最多显示15条评价记录
    //   if (evaluateList.value.length > 15) {
    //     evaluateList.value.shift()
    //   }
    }, 5000)
  }

  onUnmounted(() => {
    if (timer)
      clearInterval(timer)
  })

  return {
    env1,
    env2,
    playTalkAct,
    chatList,
    evaluateList,
    taskList,
    initializeData,
    startDynamicUpdate,
  }
}
