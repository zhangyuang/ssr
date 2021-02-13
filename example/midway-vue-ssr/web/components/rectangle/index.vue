
<template>
  <div class="pbbContainer">
    <div v-for="val in data[0].itemMap" :key="val.img">
      <div class="pbbItemContainer">
        <div class="pbbDescContainer">
          <div class="defaultItemBg" :style="{background: `url(${val.img}) 0 0 /cover`}" />
          <div class="pName pbbName">
            {{ val.title }}
          </div>
          <div class="pDesc pbbName">
            {{ val.subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['data']
}
</script>

<style lang="less">
@import "./index.less";
</style>
