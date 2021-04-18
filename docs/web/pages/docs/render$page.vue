<template>
  <DocsLayout :config="config" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import DocsLayout from '@/layout/docsLayout/index.vue'
import config from './config'

export default defineComponent({
  components: {
    DocsLayout
  },
  data () {
    return {
      config
    }
  },
  computed: {
    ...mapState({
      indexData: state => state.indexStore?.data
    })
  }
})
</script>

<style>

</style>
