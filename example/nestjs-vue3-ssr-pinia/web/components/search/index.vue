<template>
  <div class="searchContainer">
    <input :value="searchText" type="text" class="input" placeholder="该搜索框内容会在所有页面共享" @input="setText">
    <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" class="searchImg" @click="toSearch">
  </div>
</template>

<script lang="ts" setup>
import { useSearchStore } from '@/pinia-store'
const store = useSearchStore()
const searchText = store.searchText

const setText = (e: any) => {
  store.setData({
    text: e.target.value
  })
}
const toSearch = () => {
  location.href = `https://search.youku.com/search_video?keyword=${searchText}`
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
