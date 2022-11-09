<template>
  <router-view :asyncData="asyncData" />
</template>

<script lang="ts">
// 在这里可以进行一些全局组件的注册逻辑
export default {
   props: ['asyncData']
}
</script>

<style lang="less">
@import '@/common.less';
</style>
