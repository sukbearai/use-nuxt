<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: () => {
      return ''
    },
  },
})

const emits = defineEmits(['update:modelValue'])

const tinymceId = ref(`vue-tinymce-${(new Date()).getTime()}${(Math.random() * 1000).toFixed(0)}`)
const editorRef: any = ref(null)

const modelValue = computed({
  get: () => props.modelValue, // 取得v-model值
  set: newValue => emits('update:modelValue', newValue), // 更新v-model值
})

const conf = {
  selector: `#${tinymceId.value}`,
  language_url: '/plugins/tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  promotion: false,
  branding: false,
}
</script>

<template>
  <Editor
    :id="tinymceId"
    ref="editorRef"
    v-model="modelValue"
    disabled
    :init="conf"
    tinymce-script-src="/plugins/tinymce/tinymce.min.js"
  />
</template>
