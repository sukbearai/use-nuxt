<template>
  <div class="ml-[8px]">
    <div class="mb-[8px] text-[1rem] text-[#fff]">
      PLC状态：<span :style="{ color: true ? '#00FFA2' : '#FF5D5D' }">正常</span>
    </div>
    <div class="mb-[8px] text-[1rem] text-[#fff]">
      轴一：<span :style="{ color: true ? '#00FFA2' : '#FF5D5D' }">正常</span>
    </div>
    <div class="mb-[8px] text-[1rem] text-[#fff]">
      轴二：<span :style="{ color: false ? '#00FFA2' : '#FF5D5D' }">异常</span>
    </div>
    <div class="mb-[8px] text-[1rem] text-[#fff]">
      轴三：<span :style="{ color: true ? '#00FFA2' : '#FF5D5D' }">正常</span>
    </div>
    <div class="mb-[8px] text-[1rem] text-[#fff]">
      轴四：<span :style="{ color: true ? '#00FFA2' : '#FF5D5D' }">正常</span>
    </div>
  </div>
</template>
