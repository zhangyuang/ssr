<template>
  <div class="search">
    <div class="search_input">
      <input class='search-query' type="text" v-model="inputVal" @keyup.enter="searchQuery" @input="handleChange" @focus="handleFoucs(true)" @blur="handleFoucs(false)">
    </div>
    <div class="search_content" v-if="resultList.length">
      <searchShow :list="resultList"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import matchQuery from './matchQuery'
import searchShow from './components/searchShow/index.vue'

export default defineComponent({
  data () {
    return {
      isFocus: false,
      resultList: [] as Array<any>,
      inputVal: ''
    }
  },
  inject: ['asyncData'],
  components: {
    searchShow
  },
  mounted () {
  },
  methods: {
    handleFoucs(bool: boolean) {
      this.isFocus = bool
    },
    handleChange() {
      this.searchQuery()
    },
    async searchQuery() {
      if(!this.inputVal.length) return;
      this.resultList = await matchQuery.match(this.inputVal, this.asyncData.value.config)
    },
  }
})
</script>

<style scoped lang="less">
@import "./index.less";
</style>
