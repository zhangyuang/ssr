<template>
  <div>
    <Search />
    <template v-if="indexData">
      <Rectangle :data="indexData[1].components" />
    </template>
    <template v-else>
      <img
        src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif"
        class="loading"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useIndexStore } from "@/pinia-store";
import Rectangle from "@/components/rectangle/index.vue";
import Search from "@/components/search/index.vue";

const indexStore = useIndexStore();
const indexData = indexStore.data;
</script>
