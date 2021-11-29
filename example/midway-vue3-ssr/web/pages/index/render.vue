
<template>
  <div>
    <Search />
    <Button>123</Button>
    <template v-if="indexData">
      <Slider :data="indexData[0].components" />
      <Rectangle :data="indexData[1].components" />
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import Slider from '@/components/slider/index.vue'
import Rectangle from '@/components/rectangle/index.vue'
import Search from '@/components/search/index.vue'
import Button from 'vant/lib/button/index.js'
import 'vant/lib/index.css'

export default defineComponent({
  components: {
    Slider,
    Rectangle,
    Search,
    Button
  },
  computed: {
    ...mapState({
      indexData: state => state.indexStore?.data
    })
  }
})
</script>

<style>
</style>
