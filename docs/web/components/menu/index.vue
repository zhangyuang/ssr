<template>
  <nav class="menu">
    <!-- 第一层 -->
    <div v-for="(item,index) in menuList" :key="index" class="menu_content">
      <div class="menu_flex menu_title">
        <div class="menu_text_left">
          <img v-if="!item.path && (item.routes || []).length" :src="item.open ? '/images/arrow.svg' : '/images/arrow_right.svg'" class="menu_arrow" alt="error">
        </div>
        <div>
          <a class="menu_text_text" @click="handleOpen(item)">{{ item.title }}</a>
        </div>
      </div>
      <!-- 第二层 -->
      <template v-if="item.open">
        <div v-for="(item2,index) in item.routes" :key="index">
          <div class="menu_flex menu_item">
            <div class="menu_text_left" />
            <div>
              <a class="menu_text_text" @click="handleClick(item2)">{{ item2.title }}</a>
            </div>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  inject: ['asyncData'],
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      menuList: [] as Array<Record<string, any>>
    }
  },
  watch: {
    asyncData: {
      handler (val) {
        const { list } = this.$props
        this.createMenu(list, val.value.pagePath)
      },
      deep: true
    }
  },
  created () {
    const { list } = this.$props
    this.createMenu(list, this.asyncData.value.pagePath)
  },
  methods: {
    handleOpen (data) {
      data.open = !data.open
      this.handleClick(data)
    },
    handleClick (data) {
      if (data.path) {
        this.$router.push({
          path: `/docs/${data.path}`
        })
        window.scrollTo({
          left: 0,
          top: 0
        })
      }
    },
    createMenu (list, pagePath) {
      const pathname:string = pagePath || ''
      this.menuList = list.map((menu) => {
        let open = false;
        (menu.routes || []).forEach((item) => {
          if (item.path && pathname?.indexOf(item.path.replace(/\$/g, '/')) !== -1) {
            open = true
          }
        })
        menu.open = open
        return menu
      })
    }
  }
})
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
