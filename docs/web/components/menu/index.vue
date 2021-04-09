<template>
  <nav class="menu">
    <div
      v-for="(item,index) in list"
      :key="index"
      :class="[
        'menu_top'
      ]"
    >
      <div class="menu_flex menu_title">
        <div class="menu_item_left">
          <img src="/images/arrow.svg" class="menu_arrow" alt="error" v-if="!item.path && (item.routes || []).length">
        </div>
        <div>
          <a class="menu_item_text" @click="handleClick(item)">{{item.title}}</a>
        </div>
      </div>
      <div
        v-for="(item2,index) in item.routes"
        :key="index"
        :class="[
         'menu_item'
        ]"
      >
        <div class="menu_flex">
          <div class="menu_item_left"/>
          <div>
            <a class="menu_item_text" @click="handleClick(item2)">{{item2.title}}</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {flatArray} from '../../utils/flatArray';

export default {
  props: {
    list: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {}
  },
  created() {
    const {list} = this.$props;
    this.initMdContent(list)
  },
  methods: {
    initMdContent(list) {
      const flatList = flatArray(list, 'routes').filter((r) => r.hasOwnProperty('path') && r.path !== '')
      if (flatList.length > 0) {
        this.handleChange(flatList[0])
      }
    },
    handleClick(data) {
      if (data.path) {
        this.handleChange(data)
      }
    },
    handleChange(data) {
      this.$emit('changeContent', data);
    },
    // getHref(data) {
    //   const location = window.location || ''
    //   const href = (location?.href?.replace(location.origin, '').split('#')[0] || '/') + '#' + data.n
    //   return ''
    // },
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
