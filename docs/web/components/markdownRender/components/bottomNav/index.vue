<template>
  <div class="bottomNav">
    <div class="bottomNav_left" @click="handleClick(left)">
      <template v-if="left.path">
        <img src="/images/arrow_left_row.svg" alt="">
        <a>{{ left.title }}</a>
      </template>
    </div>
    <div class="bottomNav_right" @click="handleClick(right)">
      <template v-if="right.path">
        <a>{{ right.title }}</a>
        <img src="/images/arrow_right_row.svg" alt="">
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { flatArray } from '@/utils/flatArray'

export default defineComponent({
  inject: ['asyncData'],
  props: {
    config: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      left: {},
      right: {}
    }
  },
  watch: {
    config (newValue) {
      this.createNav(newValue, this.asyncData.value.pagePath)
    },
    asyncData: {
      handler (val) {
        const { config } = this.$props
        this.createNav(config, this.asyncData.value.pagePath)
      },
      deep: true
    }
  },
  created () {
    const { config } = this.$props
    this.createNav(config, this.asyncData.value.pagePath)
  },
  methods: {
    createNav (config, pagePath) {
      const equalPath = (path) => {
        if (!path) return false
        return path.replace(/\$/g, '/') === pagePath
      }
      config.forEach((item) => {
        item.topLevel = true
      })
      const flatConfig = flatArray(config, 'routes')
      const index = flatConfig.findIndex((item) => equalPath(item.path))
      if (index - 1 >= 0) {
        const leftData = flatConfig[index - 1] || {}
        this.left = leftData.topLevel ? {} : leftData
      }
      if (index + 1 <= flatConfig.length) {
        const rightData = flatConfig[index + 1] || {}
        this.right = rightData.topLevel ? {} : rightData
      }
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
    }
  }
})
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
