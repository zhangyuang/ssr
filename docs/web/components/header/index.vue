<template>
  <div class="header">
    <div class="header__left">
      <router-link class="logo" to="/">
        <img src="/images/logo.jpeg" alt="">
      </router-link>
    </div>
    <div class="nav">
      <div class="nav_left"/>
      <searchBox />
      <router-link v-for="item in headerItems" :key="item.path" :to="item.path">
        {{ item.label }}
      </router-link>
      <a target="__black" href="https://github.com/ykfe/ssr">
        Github
      </a>
      <a target="__black" href="http://fe.ssr-fc.com/">
        前端开发手册
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { webSiteConfig } from '../../config/index'
import searchBox from '../searchBox/index.vue'

export default defineComponent({
  data () {
    return {
      headerItems: webSiteConfig.header.items,
      activePath: '/'
    }
  },
  components: {
    searchBox
  },
  mounted () {
  },
  methods: {
  }
})
</script>

<style lang="less">
@import "../../common.less";
@import "./index.less";
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header__left {
    display: flex;
    width: 15%;
  }
}
.nav {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  // justify-content: space-between;
  a {
    padding: 0 15px;
  }
}
.nav_left {
  flex: 1;
}
</style>
