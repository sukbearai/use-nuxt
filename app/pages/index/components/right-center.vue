<script setup lang="ts">
import { ranking } from '~/services/v'

const config = ref({
  showValue: true,
  unit: '次',
})
const data = ref([])
function getData() {
  ranking()
    .then((res: any) => {
      if (res.data.success) {
        data.value = res.data.data
      }
      else {
        ElMessage({
          message: res.data.msg,
          type: 'warning',
        })
      }
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}
getData()
</script>

<template>
  <div class="right_bottom">
    <VCapsuleChart :config="config" style="width: 100%; height: 260px" :data="data" />
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  box-sizing: border-box;
  padding: 0 16px;
}
</style>
