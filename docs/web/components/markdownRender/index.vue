<template>
  <div class="md-render">
    <div class="md-render_content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="html" />
      <bottomNav :config="config" />
    </div>
    <div class="md-render_side">
      <SideMenu :list="sideMenuList" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import markdownIt from 'markdown-it'
// import Darkmode from 'darkmode-js';
import markdownItAnchor from 'markdown-it-anchor'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import SideMenu from './components/sideMenu/index.vue'
import bottomNav from './components/bottomNav/index.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

export default defineComponent({
  components: {
    SideMenu,
    bottomNav
  },
  inject: ['asyncData'],
  props: {
    config: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      html: '' as string,
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
  methods: {
    renderHtml (content) {
      const md = markdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return `<pre><code class="hljs">${hljs.highlight(str, {
                language: lang
              }).value}</code></pre>`
            } catch (__) {}
          }
          return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
        }
      })
      md.enable(['link'])
        .enable('image')
        .enable('table')

      md.use(markdownItAnchor, {
        // permalink: true,
        // permalinkBefore: true,
        // permalinkSymbol: '§',
        slugify: (s) => s
      })
      md.use(markdownItTocDoneRight, {
        callback: (_, ast) => {
          this.sideMenuList = ast.c
        }
      })
      this.html = md.render(content)
    }
  }
})
</script>

<style lang="less" scoped>
@import "./index.less";
</style>

<style lang="less">
.hljs {
  border-radius: 5px;

  code {
    color: initial;
    background-color: initial;
  }
}

pre {
  margin-bottom: 1.3rem;
}

code {
  background-color: var(--drake-code-single-bg);
  color: var(--drake-code-single);
  padding: .25rem;
  font-style: normal;
  border-radius: .25rem;
}
</style>
