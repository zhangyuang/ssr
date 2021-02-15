
<template>
  <div class="pbbContainer">
    <div v-for="val in data[0].itemMap" :key="val.img" class="pbbItemContainer">
      <div class="pbbDescContainer">
        <div class="defaultItemBg" :style="{background: `url(${val.img}) 0 0 /cover`}" @click="toDetail" />
        <div class="pName pbbName">
          {{ val.title }}
        </div>
        <div class="pDesc pbbName">
          {{ val.subtitle }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['data'],
  methods: {
    toDetail () {
      this.$router.push('/detail/cbba934b14f747049187')
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
