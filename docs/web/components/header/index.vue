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

<style scoped lang="less">
@import "../../common.less";
@import "./index.less";
</style>
