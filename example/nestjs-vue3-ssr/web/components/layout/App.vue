<template>
  <router-view :reactiveFetchData="reactiveFetchData" />
</template>

<script lang="ts" setup>
// Register global plugins/components here
// Read document get more details http://doc.ssr-fc.com/docs/features$communication#props%20%E7%9B%B4%E5%87%BA%E6%95%B0%E6%8D%AE
import { defineProps, App } from 'vue'

const props = defineProps<{
  ssrApp: App,
  reactiveFetchData: any,
  asyncData: any
}>()
</script>

<style lang="less">
@import '@/common.less';
</style>
