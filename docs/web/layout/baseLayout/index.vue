<template>
  <div class="base-layout">
    <Header />
    <div class="base-layout_content">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Header from '@/components/header'
import Footer from '@/components/footer'
import Menu from '@/components/menu'

export default {
  components: {
    Header,
    Footer,
    Menu
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
