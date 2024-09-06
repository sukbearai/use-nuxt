<!-- z-paging聊天输入框 -->

<script>
export default {
  name: 'ChatInputBar',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['send', 'emojiTypeChange'],
  data() {
    return {
      msg: '',

      // 表情数组（如果不需要切换表情面板则不用写）
      emojisArr: [
        '😊',
        '😁',
        '😀',
        '😃',
        '😣',
        '😞',
        '😩',
        '😫',
        '😲',
        '😟',
        '😦',
        '😜',
        '😳',
        '😋',
        '😥',
        '😰',
        '🤠',
        '😎',
        '😇',
        '😉',
        '😭',
        '😈',
        '😕',
        '😏',
        '😘',
        '😤',
        '😡',
        '😅',
        '😬',
        '😺',
        '😻',
        '😽',
        '😼',
        '🙈',
        '🙉',
        '🙊',
        '🔥',
        '👍',
        '👎',
        '👌',
        '✌️',
        '🙏',
        '💪',
        '👻',
      ],
      // 当前input focus（如果不需要切换表情面板则不用写）
      focus: false,
      // 当前表情/键盘点击后的切换类型，为空字符串代表展示表情logo但是不展示不展示表情面板（如果不需要切换表情面板则不用写）
      emojiType: '',
    }
  },
  methods: {
    // 更新了键盘高度（如果不需要切换表情面板则不用写）
    updateKeyboardHeightChange(res) {
      if (res.height > 0) {
        // 键盘展开，将emojiType设置为emoji
        this.emojiType = 'emoji'
      }
    },
    // 用户尝试隐藏键盘，此时如果表情面板在展示中，应当隐藏表情面板，如果是键盘在展示中不用处理，z-paging内部已经处理（如果不需要切换表情面板则不用写）
    hidedKeyboard() {
      if (this.emojiType === 'keyboard')
        this.emojiType = ''
    },
    // 点击了切换表情面板/键盘（如果不需要切换表情面板则不用写）
    emojiChange() {
      this.$emit('emojiTypeChange', this.emojiType)
      if (this.emojiType === 'keyboard') {
        // 点击了键盘，展示键盘
        this.focus = true
      }
      else {
        // 点击了切换表情面板
        this.focus = false
        // 隐藏键盘
        uni.hideKeyboard()
      }
      this.emojiType
        = !this.emojiType || this.emojiType === 'emoji' ? 'keyboard' : 'emoji'
    },
    // 点击了某个表情，将其插入输入内容中（如果不需要切换表情面板则不用写）
    emojiClick(text) {
      this.msg += text
    },

    // 点击了发送按钮
    sendClick() {
      if (!this.msg.length)
        return
      this.$emit('send', this.msg)
      this.msg = ''
    },
  },
}
</script>

<template>
  <div class="chat-input-bar-container">
    <div class="chat-input-bar">
      <div class="chat-input-container">
        <!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
        <el-input
          v-model="msg"
          :focus="focus"
          class="chat-input"
          :adjust-position="false"
          confirm-type="send"
          placeholder="添加内容..."
          @press-enter="sendClick"
        />
      </div>
      <!-- 表情图标（如果不需要切换表情面板则不用写） -->
      <!-- <view class="emoji-container">
        <image
          class="emoji-img"
          :src="`/static/${emojiType || 'emoji'}.png`"
          @click="emojiChange"
        />
      </view> -->
      <div class="chat-input-send" @click="sendClick">
        <el-button :loading="loading" type="primary" class="chat-input-send-text">
          发送
        </el-button>
      </div>
    </div>
    <!--  表情面板，这里使用height控制隐藏显示是为了有高度变化的动画效果（如果不需要切换表情面板则不用写） -->
    <!-- <view
      class="emoji-panel-container"
      :style="[{ height: emojiType === 'keyboard' ? '200px' : '0px' }]"
    >
      <scroll-view scroll-y style="height: 100%; flex: 1">
        <view class="emoji-panel">
          <text
            v-for="(item, index) in emojisArr"
            :key="index"
            class="emoji-panel-text"
            @click="emojiClick(item)"
          >
            {{ item }}
          </text>
        </view>
      </scroll-view>
    </view> -->
  </div>
</template>

<style scoped>
.chat-input-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.chat-input-container {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  padding: 8px;
  background-color: white;
  border-radius: 5px;
}
.chat-input {
  flex: 1;
  font-size: 14px;
}
.emoji-container {
  width: 24px;
  height: 24px;
  margin: 5px 0rpx 5px 10px;
}
.emoji-img {
  width: 24px;
  height: 24px;
}
.chat-input-send {
  background-color: #007aff;
  margin: 5px 5px 5px 10px;
  border-radius: 10px;
  width: 60px;
  height: 30px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}
.chat-input-send-text {
  color: white;
  font-size: 14px;
}
.emoji-panel-container {
  background-color: #f8f8f8;
  overflow: hidden;
  transition-property: height;
  transition-duration: 0.15s;
  /* #ifndef APP-NVUE */
  will-change: height;
  /* #endif */
}
.emoji-panel {
  font-size: 15px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: 5px;
  padding-left: 8px;
  padding-bottom: 5px;
}
.emoji-panel-text {
  font-size: 25px;
  margin-left: 8px;
  margin-top: 10px;
}
</style>
