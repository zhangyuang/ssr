<template>
  <div class="md-render">
    <div class="md-render_content" v-html="html" />
    <div class="md-render_side">
      <SideMenu :list="sideMenuList" />
    </div>
  </div>
</template>

<script lang="ts">
import markdownIt from 'markdown-it'
// import Darkmode from 'darkmode-js';
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import SideMenu from './components/sideMenu/index.vue'
import prism from './themes/prism.js'

export default {
  components: {
    SideMenu
  },
  inject: ['asyncData'],
  data () {
    return {
      html: '',
      sideMenuList: []
    }
  },
  watch: {
    asyncData: {
      handler (val) {
        this.renderHtml(val.value.docsContent)
      },
      deep: true
    }
  },
  created () {
    this.renderHtml(this.asyncData.value.docsContent)
  },
  mounted () {
    prism.highlightAll()
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
