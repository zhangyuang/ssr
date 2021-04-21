<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, reactive, provide } from 'vue'
export default defineComponent({
  props: ['asyncData'],
  setup (props) {
    const reactiveAsyncData = reactive(props.asyncData) // asyncData.value 是 fetch.ts 的返回值，将 provide 的数据变为响应式
    const changeAsyncData = (key, value) => {
      reactiveAsyncData.key = value
    }
    provide('asyncData', reactiveAsyncData)
    provide('changeAsyncData', changeAsyncData)
  }
})
</script>
