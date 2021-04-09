<template>
  <div class="docs-layout">
    <Header></Header>
    <div class="docs-layout_content">
      <div class="docs-layout_content_left">
        <Menu :list="config" @changeContent="handleChange"></Menu>
      </div>
      <div class="docs-layout_content_right">
        <MarkdownRender :content="mdContent"></MarkdownRender>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/header'
import Footer from '@/components/footer'
import Menu from '@/components/menu'
import MarkdownRender from '@/components/markdownRender'


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
      required: true,
    }
  },
  data() {
    return {
      mdContent: ''
    }
  },
  methods: {
    async handleChange(data) {
      try {
        this.mdContent = (await import(`@/docs/${data.path}`)).default
      } catch (e) {
        console.log('err', e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
