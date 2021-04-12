<template>
  <div class="base-layout">
    <Header></Header>
    <div class="base-layout_content">
      <slot></slot>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/header'
import Footer from '@/components/footer'
import Menu from '@/components/menu'

export default {
  components:{
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
