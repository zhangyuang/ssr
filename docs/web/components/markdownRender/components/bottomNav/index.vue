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

// 获取上一个或下一个有效文档
const getBetweenData:(
  isNext: boolean,
  index: number,
  list: Array<Record<string, any>>
)=>Record<string, any> = (isNext, index, list) => {
  if (isNext) {
    for (let i = index + 1; list.length > i; i++) {
      if (list[i]?.path) {
        return list[i]
      }
    }
    return {}
  }
  for (let i = index - 1; i >= 0; i--) {
    if (list[i]?.path) {
      return list[i]
    }
  }
  return {}
}

export default defineComponent({
  inject: ['asyncData'],
  data () {
    return {
      left: {},
      right: {}
    }
  },
  watch: {
    asyncData: {
      handler (val) {
        this.createNav(val.value)
      },
      deep: true
    }
  },
  created () {
    this.createNav(this.asyncData.value)
  },
  methods: {
    createNav (value) {
      const { pagePath, config } = value
      const equalPath = (path) => {
        if (!path) return false
        return path.replace(/\$/g, '/') === pagePath
      }
      const flatConfig = flatArray(config, 'routes')
      const index = flatConfig.findIndex((item) => equalPath(item.path))
      this.left = getBetweenData(false, index, flatConfig)
      this.right = getBetweenData(true, index, flatConfig)
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
