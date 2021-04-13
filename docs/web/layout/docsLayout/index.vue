<template>
  <div class="docs-layout">
    <Header />
    <div class="docs-layout_content">
      <div class="docs-layout_content_left">
        <Menu :list="config" @changeContent="handleChange" />
      </div>
      <div class="docs-layout_content_right">
        <MarkdownRender ref="MarkdownRender" :content="mdContent" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
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
      required: true
    }
  },
  data () {
    return {
      mdContent: ''
    }
  },
  methods: {
    async handleChange (data) {
      try {
        this.mdContent = (await import(`../../docs/${data.path}.md`)).default
        console.log('this.mdContent', this.mdContent)
        this.$refs.MarkdownRender.renderHtml(this.mdContent)
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
