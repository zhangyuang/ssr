
<template>
  <div>
    <Search />
    <template v-if="detailData">
      <Player :data="detailData[0].dataNode" />
      <Brief :data="detailData[1].dataNode" />
      <Recommend :data="detailData[2].dataNode" />
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script lang="ts" setup>
import Player from '@/components/player/index.vue'
import Brief from '@/components/brief/index.vue'
import Recommend from '@/components/recommend/index.vue'
import Search from '@/components/search/index.vue'
import { useDetailStore } from '@/pinia-store'

const detailStore = useDetailStore()
const detailData = detailStore.data
</script>

<style>

</style>
