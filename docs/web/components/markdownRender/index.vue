<template>
  <div class="md-render">
    {{ docsContent }}
    <!-- <div class="md-render_content" v-html="html" />
    <div class="md-render_side">
      <SideMenu :list="sideMenuList" />
    </div> -->
  </div>
</template>

<script lang="ts">
import { inject } from 'vue'
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
  setup () {
    const docsContent = inject('asyncData').value.docsContent
    return {
      docsContent
    }
  },
  data () {
    return {
      html: '',
      sideMenuList: []
    }
  },
  watch: {
    docsContent () {
      console.log('xxx', this.docsContent)
    }

  },
  created () {
    // this.renderHtml(this.docsContent)
  },

  mounted () {
    setTimeout(() => {
      prism.highlightAll()
    }, 10)
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
