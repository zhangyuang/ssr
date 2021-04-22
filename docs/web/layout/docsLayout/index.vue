<template>
  <div>
    <Header />
    <div class="docs-layout">
      <div class="docs-layout_content">
        <div class="docs-layout_content_left">
          <Menu />
        </div>
        <div class="docs-layout_content_right">
          <MarkdownRender />
        </div>
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
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
