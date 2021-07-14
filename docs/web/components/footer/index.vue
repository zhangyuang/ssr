<template>
  <div class="footer">
    <div class="footer__link">
      <div
        v-for="item in footerItems"
        :key="item.path"
        class="item-wrapper weui-flex__item justify-align"
      >
        <h5>{{ item.label }}</h5>
        <div
          v-for="child in item.children"
          :key="child.path"
          class="child-item weui-flex__item"
        >
          <div>
            <a :href="child.path">{{ child.label }}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__desc weui-flex justify-align">
      © 2021 docs.ssr-fc.com • Privacy • Terms of Use
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { webSiteConfig } from '../../config/index'
export default defineComponent({
  props: ['data'],
  data () {
    return {
      footerItems: webSiteConfig.footer.items
    }
  },
  methods: {}
})
</script>

<style lang="less" scoped>
@import "./index.less";
@import "../../common.less";
</style>
