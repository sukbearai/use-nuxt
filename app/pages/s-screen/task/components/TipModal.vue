<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
  },
  countdown: {
    type: Number,
    default: 5,
  },
})

const list = ref([
  '测量过程中，避免使测量杆突然撞落到工件上，也不可强烈震动或敲打指示表。',
  '注意测量范围，不要使测头位移超出量程，以以免过度伸长弹簧而损坏指示表。',
  '不要使测头跟测杆做过多无效的运动以减少零件磨损并保持表的精度。',
])
</script>

<template>
  <a-modal
    :open="props.visible"
    :width="460"
    :hide-title="true"
    :footer="false"
    :closable="false"
    :mask-closable="false"
    :keyboard="false"
    :centered="true"
  >
    <div class="mb-[14px] flex items-center space-x-[12px]">
      <ExclamationCircleFilled class="text-[24px] text-[#FF7D00]" />
      <span class="text-[18px] text-[#1D2129] font-medium">注意事项</span>
    </div>
    <div class="ml-[38px] flex flex-col space-y-[8px]">
      <div
        v-for="item in list"
        :key="item"
        class="flex items-start space-x-[4px]"
      >
        <div
          class="mt-[10px] h-[4px] w-[4px] shrink-0 rounded-[2px] bg-[#6B6AFF]"
        />
        <div
          class="break-all text-[1rem] text-[#4E5969] font-medium leading-[24px]"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="mt-[20px] text-center text-[#86909C]">
      {{ props.countdown }} 秒后关闭
    </div>
  </a-modal>
</template>
