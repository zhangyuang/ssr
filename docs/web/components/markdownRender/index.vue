<template>
  <div class="md-render">
    <div class="md-render_content" v-html="html" />
    <div class="md-render_side">
      <SideMenu :list="sideMenuList" />
    </div>
  </div>
</template>

<script lang="ts">
import prism from './themes/prism.js'
import markdownIt from 'markdown-it'
// import Darkmode from 'darkmode-js';
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import SideMenu from './components/sideMenu/index.vue'

export default {
  components: {
    SideMenu
  },
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      html: '',
      sideMenuList: []
    }
  },
  mounted () {
    setTimeout(() => {
      prism.highlightAll()
    }, 10)
  },
  created () {
    const { content } = this.$props
    console.log('content', content)
    this.renderHtml(content)
  },
  methods: {
    renderHtml (content) {
      const md = markdownIt({
        html: true,
        linkify: true,
        typographer: true
      }).use(markdownItAnchor, {
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '§',
        slugify: (s) => s
      }).use(markdownItTocDoneRight, {
        callback: (_, ast) => {
          this.sideMenuList = ast.c
        }
      }).render(content)
      this.html = md
    }
  }
}
</script>

<style lang="less" scoped>
@import './themes/prism.css';
@import "./index.less";
</style>
