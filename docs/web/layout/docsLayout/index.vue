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
import Footer from '@/components/footer'
import Menu from '@/components/menu'
import MarkdownRender from '@/components/markdownRender'

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
