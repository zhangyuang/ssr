<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import Menu from '@/components/menu/index.vue'
import MarkdownRender from '@/components/markdownRender/index.vue'

export default {
  components: {
    Menu,
    MarkdownRender
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
