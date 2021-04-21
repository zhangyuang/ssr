<template>
  <div class="footer">
    <div class="footer__link weui-flex justify-align">
      <div
        class="item-wrapper weui-flex__item justify-align"
        v-for="item in footerItems"
        :key="item.path"
      >
        <h5>{{ item.label }}</h5>
        <div
          class="child-item weui-flex__item"
          v-for="child in item.children"
          :key="child.path"
        >
          <div>
            <a :href="child.path">{{ child.label }}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer__desc weui-flex justify-align">© 2021 docs.ssr-fc.com • Privacy • Terms of Use</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { webSiteConfig } from "../../config/index";
export default defineComponent({
  props: ["data"],
  data() {
    return {
      footerItems: webSiteConfig.footer.items,
    };
  },
  methods: {},
});
</script>

<style lang="less" scoped>
@import "./index.less";
@import "../../common.less";
</style>
