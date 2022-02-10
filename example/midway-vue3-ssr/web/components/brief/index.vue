
<template>
  <div class="brief-info">
    <div class="brief-title">
      <span class="['icon-GOLDEN']">{{ briefData.mark.value.data.text }}</span>
      <h1>{{ briefData.showName }}</h1>
    </div>
    <div class="brief-score">
      <span v-for="(item, index) in briefData.subTitleList.value" :key="item.subtitle" :class="item.subtitleType === 'PLAY_VV' ? 'hotVv' : ''">
        <img v-if=" item.subtitleType === 'PLAY_VV'" :src="briefData.heatIcon.value" alt="">
        <span v-if="index > 0" class="divide">/</span>
        <span>{{ item.subtitle }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from 'vue'
import { BriefDataNode } from '~/typings/data'

const props = defineProps<{
  data: BriefDataNode[]
}>()
const briefData = toRefs(props.data[0].data)
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
