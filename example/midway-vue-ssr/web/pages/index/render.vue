
<template>
  <div>
    <Search />
    <template v-if="indexData">
      <Slider :data="indexData[0].components" />
      <Rectangle :data="indexData[1].components" />
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'
import Search from '@/components/search'

export default {
  components: {
    Slider,
    Rectangle,
    Search
  },
  computed: {
    ...mapState({
      indexData: state => {
        // vue2 template doesn't support optional chainning
        if (state?.indexStore?.data?.[1]?.components) {
          return state.indexStore.data
        } else {
          return false
        }
      }
    })
  }

}
</script>

<style>

</style>
