
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

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { ItemMapArr } from '~/typings/data'

const Router = useRouter()
defineProps<{
  data: ItemMapArr[]
}>()
const toDetail = () => {
  Router.push('/detail/cbba934b14f747049187')
}

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
