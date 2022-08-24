
<template>
  <div>
    <div class="title">
      为你推荐
    </div>
    <div class="reContainer">
      <div v-for="item in data " :key="item.data.heat" class="reContent">
        <img :src="item.data.img">
        <div class="vTitle">
          {{ item.data.title }}
        </div>
        <div class="subTitle">
          {{ item.data.subtitle }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { RecommendDataNode } from '~/typings/data'

defineProps<{
  data: RecommendDataNode[]
}>()

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
