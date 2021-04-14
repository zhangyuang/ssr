<template>
  <nav class="menu">
    <div v-for="(item,index) in list" :key="index" :class="[ 'menu_top' ]">
      <div class="menu_flex menu_title">
        <div class="menu_item_left">
          <img v-if="!item.path && (item.routes || []).length" src="/images/arrow.svg" class="menu_arrow" alt="error">
        </div>
        <div>
          <a class="menu_item_text" @click="handleClick(item)">{{ item.title }}</a>
        </div>
      </div>
      <div v-for="(item2,index) in item.routes" :key="index" :class="[ 'menu_item' ]">
        <div class="menu_flex">
          <div class="menu_item_left" />
          <div>
            <a class="menu_item_text" @click="handleClick(item2)">{{ item2.title }}</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">

export default {
  props: ['list', 'changeContent'],
  emits: ['changeContent'],
  data () {
    return {}
  },
  created () {
  },
  methods: {
    handleClick (data) {
      const path = data.path.replace('/', '-')
      this.$router.push(`/docs/${path}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
