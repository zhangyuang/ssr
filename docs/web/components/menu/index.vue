<template>
  <nav class="menu">
    <!-- 第一层 -->
    <div v-for="(item,index) in menuList" :key="index" class="menu_content">
      <div class="menu_flex menu_title">
        <div class="menu_left">
          <img v-if="!item.path && (item.routes || []).length" :src="item.open ? '/images/arrow.svg' : '/images/arrow_right.svg'" class="menu_arrow" alt="error">
        </div>
        <div>
          <a class="menu_text menu_bold" @click="handleOpen(item)">{{ item.title }}</a>
        </div>
      </div>
      <!-- 第二层 -->
      <template v-if="item.open">
        <div v-for="(item2,index) in item.routes" :key="index">
          <div class="menu_flex menu_item">
            <div class="menu_left" />
            <div>
              <a :class="['menu_text', item2.active ? 'active': '' ]" @click="handleClick(item2)">{{ item2.title }}</a>
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
  data () {
    return {
      menuList: [] as Array<Record<string, any>>
    }
  },
  watch: {
    $route (val) {
      const path = val.path.replace('/docs/', '').replace('$', '/')
      this.createMenu({
        config: this.asyncData.value.config,
        pagePath: path
      })
    }
  },
  created () {
    this.createMenu(this.asyncData.value)
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
    createMenu (value) {
      const { config, pagePath } = value
      const pathname:string = pagePath || ''
      this.menuList = config.map((menu) => {
        let open = false;
        (menu.routes || []).forEach((item) => {
          if (item.path && pathname === item.path.replace(/\$/g, '/')) {
            item.active = true
            open = true
          } else {
            item.active = false
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
