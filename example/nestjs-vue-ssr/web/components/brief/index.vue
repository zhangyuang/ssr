
<template>
  <div class="brief-info">
    <div class="brief-title">
      <span class="['icon-GOLDEN']">{{ briefData.mark.data.text }}</span>
      <h1>{{ briefData.showName }}</h1>
    </div>
    <div class="brief-score">
      <span v-for="(item, index) in briefData.subTitleList" :key="item.subtitle" :class="item.subtitleType === 'PLAY_VV' ? 'hotVv' : ''">
        <img v-if=" item.subtitleType === 'PLAY_VV'" :src="briefData.heatIcon" alt="">
        <span v-if="index > 0" class="divide">/</span>
        <span>{{ item.subtitle }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
	props: ['data'],
	data() {
		return {
			briefData: this.data[0].data
		}
	}
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
