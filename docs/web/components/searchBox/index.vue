<template>
  <div class="search">
    <div class="search_input">
      <input class='search-query' type="text" @focus="handleFoucs(true)" @blur="handleFoucs(false)">
    </div>
    <div class="search_content">

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import matchQuery from './matchQuery'

export default defineComponent({
  data () {
    return {
      isFocus: false,
    }
  },
  inject: ['asyncData'],
  computed: {
  },
  mounted () {
    this.searchQuery('实现')
  },
  methods: {
    handleFoucs(bool: boolean) {
      this.isFocus = bool
    },
    searchQuery(query: string) {
      matchQuery.match(query, this.asyncData.value.config)
    },
  }
})
</script>

<style scoped lang="less">
@import "./index.less";
</style>
