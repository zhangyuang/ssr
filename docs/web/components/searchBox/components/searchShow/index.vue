<template>
  <div class="search_show">
    <!-- 章节 循环 -->
    <div v-for="(chapter, indexChapter) in list" :key="indexChapter" class="search_chapter">
      <div class="search_chapter_title">{{chapter.title}}</div>
      <!-- 文章 循环 -->
      <div v-for="(page, indexPage) in chapter.list" :key="indexPage" class="search_page">
        <!-- 文章题目(左) -->
        <div class="search_page_title">{{ page.title }}</div>
        <!-- 文章内容（右）-循环 -->
        <div class="search_page_content_out">
          <div v-for="(content, indexContent) in page.list" :key="indexContent" class="search_page_content" @click="handleClick(content)">
            <div class="search_page_content_item">
              <div class="search_page_content_title">{{content.title}}</div>
              <div class="search_page_content_detail" v-if="!content.isTitle">
                <span v-html="content.textHtml"></span>...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  inject: ['asyncData'],
  computed: {
  },
  mounted () {
  },
  methods: {
    handleClick(content) {
      if (content.path) {
        const path = `/docs/${content.path}#${encodeURIComponent(content.title)}`
        window.open(path, '_self')
      }
    },
  }
})
</script>

<style  lang="less">
.matchTextHighlight{
  font-weight: bold;
  color: var(--drake-code-single);
  background-color: var(--drake-code-single-bg);
  padding: 0.25rem;
}
</style>

<style scoped lang="less">
@import "./index.less";
</style>
