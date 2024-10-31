<script setup lang="ts">
defineProps({
  taskName: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="mb-[20px]">
    <div
      class="mb-[15px] flex items-end justify-between text-[1rem] text-[#fff]"
    >
      任务：{{ taskName }}
      <div class="text-[1.3rem] text-[#20E8CE] font-bold">
        {{ score }}分
      </div>
    </div>
    <div class="mb-[30px] text-[1rem] text-[#fff]">
      步骤：{{ description }}
    </div>
    <div class="comment-bg">
      评语
    </div>
    <div
      class="comment overflow-auto rounded-[6px] bg-[#0A1942] px-[20px] pb-[40px] pt-[20px] text-[1rem] text-[#fff]"
      :style="{ lineHeight: '30px' }"
    >
      {{ comment }}
    </div>
  </div>
</template>

<style lang="css" scoped>
.comment-bg {
  @apply flex justify-center items-center w-[96px] h-[33px] text-[1rem] text-[#fff] mb-[18px];
  background-image: url('/assets/img/comment-bg.png');
  background-size: cover;
  background-position: center center;
}
.comment::-webkit-scrollbar {
  display: none;
}
</style>
