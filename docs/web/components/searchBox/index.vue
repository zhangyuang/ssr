<template>
  <div class="search">
    <div ref="searchBoxRef" class="search_input">
      <input v-model="inputVal" class="search-query" type="text" @keyup.enter="searchQuery" @input="handleChange" @click.stop="showRes">
    </div>
    <div v-if="resultList.length && inputVal.length && show" class="search_content">
      <searchShow :list="resultList" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import debounce from 'lodash.debounce'
import { MatchQuery } from './matchQuery'
import searchShow from './components/searchShow/index.vue'

const matchQuery = new MatchQuery()

export default defineComponent({
  components: {
    searchShow
  },
  data () {
    return {
      isFocus: false,
      resultList: [] as Array<any>,
      inputVal: '',
      show: false
    }
  },
  mounted () {
    window.addEventListener('click', this.listenerClick, false)
  },
  unmounted () {
    window.removeEventListener('click', this.listenerClick, false)
  },
  methods: {
    showRes () {
      this.show = true
    },
    handleChange () {
      this.searchQuery()
    },
    searchQuery: debounce(async function () {
      if (!this.inputVal.length) return
      this.resultList = await matchQuery.match(this.inputVal)
    }, 300),
    listenerClick () {
      this.show = false
    }
  }
})
</script>

<style scoped lang="less">
@import "./index.less";
</style>
