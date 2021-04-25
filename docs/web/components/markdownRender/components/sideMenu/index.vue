<template>
  <nav class="slider">
    <div>
      <div v-for="(item,index) in dataList" :key="index" :class="[ item.relativeLevel === 0 ? 'slider_top' : 'slider_item' ]" :style="{'padding-left': `${item.relativeLevel * 10}px`}">
        <a class="slider_item_text" :href="`#${item.n}`">{{ item.n }}</a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { flatArray } from '@/utils/flatArray'

export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dataList: []
    }
  },
  watch: {
    list (newValue) {
      this.creatList(newValue)
    }
  },
  created () {
    const { list } = this.$props
    this.creatList(list)
  },
  methods: {
    creatList (list) {
      const newList = flatArray(list, 'c')
      let maxLevel = 5
      // 找到最深层级
      newList.forEach((item) => {
        if (item.l < maxLevel) {
          maxLevel = item.l
        }
      })
      // 用最深层级计算出每个节点的相对层级
      newList.forEach((item) => {
        item.relativeLevel = item.l - maxLevel
        item.n = item.n.replace(/(^\s*)|(\s*$)/g, '')
      })
      this.dataList = newList
    }
  }
})
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
