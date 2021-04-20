<template>
  <div class="docs-layout">
    <Header />
    <div class="docs-layout_content">
      <div class="docs-layout_content_left">
        <Menu :list="config" />
      </div>
      <div class="docs-layout_content_right">
        <MarkdownRender />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Header from '@/components/header/index.vue'
import Footer from '@/components/footer/index.vue'
import Menu from '@/components/menu/index.vue'
import MarkdownRender from '@/components/markdownRender/index.vue'
export default {
  components: {
    Header,
    Footer,
    Menu,
    MarkdownRender
  },
  props: {
    config: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
