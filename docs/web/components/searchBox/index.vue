<template>
  <div class="search">
    <div class="search_input" ref="searchBoxRef">
      <input class='search-query' type="text" v-model="inputVal" @keyup.enter="searchQuery" @input="handleChange" @focus="handleFoucs(true)" @blur="handleFoucs(false)">
    </div>
    <div class="search_content" v-if="resultList.length && inputVal.length && show">
      <searchShow :list="resultList" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import matchQuery from './matchQuery'
import searchShow from './components/searchShow/index.vue'
import config from '@/pages/docs/config'

export default defineComponent({
  data () {
    return {
      isFocus: false,
      resultList: [] as Array<any>,
      inputVal: '',
      show: false,
    }
  },
  inject: ['asyncData'],
  components: {
    searchShow,
  },
  mounted() {
    window.addEventListener('click', this.listenerClick)
  },
  unmounted() {
    window.removeEventListener('click', this.listenerClick)
  },
  methods: {
    handleFoucs(bool: boolean) {
      this.isFocus = bool
      if (bool) {
        this.show = true
      }
    },
    handleChange() {
      this.searchQuery()
    },
    async searchQuery() {
      if(!this.inputVal.length) return;
      this.resultList = await matchQuery.match(this.inputVal, config)
    },
    listenerClick(e){
      let target = e.target || e.srcElement // 源对象
      let isSafeNode = false
      while (target) {
        if (target === this.$refs.searchBoxRef) {
          // 循环判断至根节点，防止点击的是searchBoxRef和它的子元素
          isSafeNode = true
          break
        }
        target = target.parentNode
      }
      if (!isSafeNode) {
        // 点击的不是searchBoxRef和它的子元素，隐藏下拉
        this.show = false
      }
    }
  }
})
</script>

<style scoped lang="less">
@import "./index.less";
</style>
