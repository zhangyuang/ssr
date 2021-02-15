
<template>
  <div>
    <Search />
    <template v-if="detailData">
      <Player :data="detailData.data[0].dataNode" />
      <!-- <Brief :data="detailData.data[1].dataNode" />
      <Recommend :data="detailData.data[2].dataNode" /> -->
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Player from '@/components/player'
// import Rectangle from '@/components/rectangle'
import Search from '@/components/search'

export default {
  components: {
    Player,
    Search
  },
  computed: {
    ...mapState({
      detailData: state => state.detailStore?.data
    })
  }
}
</script>

<style>

</style>
