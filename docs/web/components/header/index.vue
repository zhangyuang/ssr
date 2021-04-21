<template>
  <div class="header weui-flex align-items">
    <div class="header__left weui-flex weui-flex__item align-items">
      <div class="logo">
        <img src="https://camo.githubusercontent.com/84219530f779a9be5213a92a852af381b5d8bac12ca193b30157831436fe682b/68747470733a2f2f67772e616c6963646e2e636f6d2f7466732f544231636b415443474c37674b306a535a46425858585a5a7058612d3534302d3534302e6a7067" alt="">
      </div>
    </div>
    <div class="header__right weui-flex weui-flex__item align-items">
      <div :class="{'weui-flex__item': true, 'active': item.path == activePath }"  @click="handleClick(item.path)" v-for="item in headerItems" :key="item.path">
        <div>
          <a :href="item.path">{{ item.label }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { webSiteConfig } from "../../config/index";
export default defineComponent({
  props: {},
  data() {
    return {
      headerItems: webSiteConfig.header.items,
      activePath: '/'
    };
  },
  mounted() {
    const route = this.$route
    const { href  = ''} = route
    const targetPath = href.split('/') && href.split('/')[1]
     this.activePath = '/docs/why'//targetPath
    console.log('mounted',this.activePath);

  },
  methods: {
    handleClick(path) {
      this.activePath = path
      console.log('path', path);
      
    }
  },
});
</script>

<style lang="less" scoped>
@import "./index.less";
@import "../../common.less";
</style>
