<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  state: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 60,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="user-info px-4">
    <el-avatar :size="props.size" :src="props.avatar" />
    <div class="text-sm" :class="props.state ? 'text-green' : 'text-red'">
      {{ props.name }}
    </div>
    <div v-if="showLabel" class="text-sm">
      <el-text v-if="props.state" class="mx-1" type="success">
        已签到
      </el-text>
      <el-text v-else class="mx-1" type="danger">
        未签到
      </el-text>
    </div>
  </div>
</template>
