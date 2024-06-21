<template>
  <div>
    <Search />
    <template v-if="indexData">
      <Slider :data="indexData[0].components" />
      <Rectangle :data="indexData[1].components" />
    </template>
    <template v-else>
      <img src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif" class="loading">
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useIndexStore } from '@/pinia-store'
import Slider from '@/components/slider/index.vue'
import Rectangle from '@/components/rectangle/index.vue'
import Search from '@/components/search/index.vue'

import { ref, onMounted } from 'vue'

const indexStore = useIndexStore()
const indexData = indexStore.data

const arr1 = ref<number[]>([1, 2, 3])

const arr2 = [...arr1.value]

onMounted(() => {
  console.log('arr2', arr2)
})
</script>
