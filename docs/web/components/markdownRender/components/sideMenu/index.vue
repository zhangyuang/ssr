<template>
  <nav class="slider">
    <div>
      <div
        v-for="(item,index) in dataList"
        :key="index"
        :class="[
          item.relativeLevel === 0 ? 'slider_top' : 'slider_item'
        ]"
        :style="{'padding-left': `${item.relativeLevel * 10}px`}"
      >
        <a class="slider_item_text" :href="getHref(item)">{{item.n}}</a>
      </div>
    </div>
  </nav>
</template>

<script>
import {flatArray} from '../../../../utils/flatArray';

export default {
  props: {
    list: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      dataList: []
    }
  },
  watch: {
    list(newValue) {
      this.creatList(newValue)
    }
  },
  created() {
    const {list} = this.$props;
    this.creatList(list)
  },
  methods: {
    creatList(list) {
      const newList = flatArray(list, 'c')
      let maxLevel = 5;
      newList.forEach((item) => {
        if (item.l < maxLevel) {
          maxLevel = item.l;
        }
      })
      newList.forEach((item) => {
        item.relativeLevel = item.l - maxLevel
        item.n = item.n.replace(/(^\s*)|(\s*$)/g, "")
      })
      this.dataList = newList
    },
    getHref(data) {
      const location = window.location || ''
      const href = (location?.href?.replace(location.origin, '').split('#')[0] || '/') + '#' + data.n
      return href
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
