<!-- z-paging聊天item -->
<script setup>
defineProps({
  item: {
    type: Object,
    default: () => ({
      time: '',
      icon: '',
      name: '',
      content: '',
      isMe: false,
    }),
  },
})
</script>

<template>
  <div class="chat-item">
    <div v-if="item.time && item.time.length" class="chat-time">
      {{ item.time }}
    </div>
    <div class="chat-container" :class="{ 'chat-location-me': item.isMe }">
      <div class="chat-icon-container">
        <el-avatar :src="item.icon" class="chat-icon" />
      </div>
      <div
        class="chat-content-container" :class="{
          'text-left': !item.isMe,
        }"
      >
        <div
          class="chat-user-name" :class="{ 'chat-location-me': item.isMe }"
        >
          {{ item.name }}
        </div>
        <div
          class="chat-text-container-super"
          :style="[{ justifyContent: item.isMe ? 'flex-end' : 'flex-start' }]"
        >
          <div
            class="chat-text-container" :class="{
              'chat-text-container-me': item.isMe,
            }"
          >
            <div class="chat-text" :class="{ 'chat-text-me': item.isMe }">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-item {
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.chat-time {
  padding: 2px 0px;
  text-align: center;
  font-size: 12px;
  color: #aaaaaa;
}
.chat-container {
  display: flex;
  flex-direction: row;
}
.chat-location-me {
  flex-direction: row-reverse;
  text-align: right;
}
.chat-icon-container {
  margin-top: 6px;
}
.chat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eeeeee;
}
.chat-content-container {
  margin: 0px 8px;
}
.chat-user-name {
  font-size: 14px;
  color: #888888;
}
.chat-text-container {
  background-color: #ededed;
  border-radius: 4px;
  padding: 5px 8px;
  margin-top: 5px;
}
.chat-text-container-me {
  background-color: purple;
}
.chat-text-container-super {
  display: flex;
  flex-direction: row;
}
.chat-text {
  font-size: 14px;
}
.chat-text-me {
  color: white;
}
</style>
