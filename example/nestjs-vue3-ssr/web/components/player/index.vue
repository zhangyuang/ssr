
<template>
  <div>
    <div v-if="play">
      <video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls autoPlay class="video">
        your browser does not support the video tag
      </video>
    </div>

    <div v-else class="playerContainer" :style="{background: `url(${playData.img}) 0 0 /cover`}">
      <div class="title">
        {{ playData.title }}
      </div>
      <img class="ico" src="https://gw.alicdn.com/tfs/TB1eA6FEW61gK0jSZFlXXXDKFXa-135-135.png" @click="playVideo">
      <div class="layer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, ref } from 'vue'
import { PlayerDataNode } from '~/typings/data'
const props = defineProps<{
  data: PlayerDataNode[]
}>()
const playData = toRefs(props.data[0].data)
const play = ref(false)
const playVideo = () => {
  play.value = true
}

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
