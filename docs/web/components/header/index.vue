<template>
  <div class="header weui-flex align-items">
    <div class="header__left weui-flex weui-flex__item align-items">
      <router-link class="logo" to="/">
        <img src="/images/logo.jpeg" alt="">
      </router-link>
    </div>
    <div class="header__right weui-flex weui-flex__item align-items">
      <router-link v-for="item in headerItems" :key="item.path" class="weui-flex__item" :to="item.path">
        {{ item.label }}
      </router-link>
      <a class="weui-flex__item" target="__black" href="https://github.com/ykfe/ssr">
        Github
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { webSiteConfig } from '../../config/index'

export default defineComponent({
  data () {
    return {
      headerItems: webSiteConfig.header.items,
      activePath: '/'
    }
  },
  mounted () {
  },
  methods: {
  }
})
</script>

<style lang="less" scoped>
@import "./index.less";
@import "../../common.less";
</style>
