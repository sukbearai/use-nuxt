<script lang="ts" setup>
import scrollIntoView from 'scroll-into-view-if-needed'

const props = defineProps({
  list: {
    type: Array<any>,
  },
})

const stepRefs = ref(new Map())

function setStepRef(
  el: Element | ComponentPublicInstance | null,
  stepId: string,
) {
  if (el)
    stepRefs.value.set(stepId, el)
}

function scrollToStep(stepId: string) {
  const el = stepRefs.value.get(stepId)
  if (el) {
    // (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
    scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' })
  }
}

watch(() => props.list, (newValue) => {
  if (newValue && newValue.length > 0) {
    nextTick(() => {
      scrollToStep((newValue?.[newValue.length - 1] as any).id)
    })
  }
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <div class="fit-content flex items-end justify-between pr-[20px]">
    <!-- <div class="ai-digit-woman h-[400px] w-[300px]" /> -->
    <Live2d />
    <div class="message-list flex-1 py-[20px] pr-[10px]">
      <div
        v-for="(item) in props.list"
        :key="item.index"
        :ref="(el) => setStepRef(el, item.id)"
        :style="{
          display: 'flex',
          justifyContent: item.answer === false ? 'flex-end' : 'flex-start',
        }"
      >
        <div v-if="!item.answer" class="flex">
          <div class="message-content bg-[#007FD5] text-[#fff]">
            {{ item.valueContent }}
          </div>
          <div class="avatar avatar-student" />
        </div>
        <div v-else class="flex">
          <div class="avatar avatar-ai" />
          <div class="message-content bg-[#102E6B] text-[#fff]">
            {{ item.valueContent }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.avatar {
  min-width: 28px;
  min-height: 28px;
  max-width: 28px;

  max-height: 28px;
  background-color: #fff;
  border-radius: 14px;
}
.avatar-ai {
  width: 28px;
  height: 28px;
  background-image: url('/assets/img/ai-avatar.png');
  background-size: cover;
  background-position: center center;
  margin-right: 16px;
  margin-top: 7px;
}
.avatar-student {
  background-image: url('/assets/img/student-avatar.png');
  background-size: cover;
  background-position: center center;
  margin-left: 16px;
}
.ai-digit-woman {
  background-image: url('/assets/img/ai-woman.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 0;
}
.message-list {
  height: 450px;
  overflow-y: auto;
}
.message-list::-webkit-scrollbar {
  display: none;
}
.message-content {
  max-width: 380px;
  display: flex;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;
}
</style>
