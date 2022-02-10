
<template>
  <div>
    <Search />
    <template v-if="detailData">
      <Player :data="detailData.data[0].dataNode" />
      <Brief :data="detailData.data[1].dataNode" />
      <Recommend :data="detailData.data[2].dataNode" />
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script lang="ts" setup>
import { mapState } from 'ssr-hoc-vue3'
import Player from '@/components/player/index.vue'
import Brief from '@/components/brief/index.vue'
import Recommend from '@/components/recommend/index.vue'
import Search from '@/components/search/index.vue'

const detailData = mapState().detailStore.value.data

</script>

<style>

</style>
