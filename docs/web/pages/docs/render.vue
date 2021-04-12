<template>
  <DocsLayout :config="config">
  </DocsLayout>
</template>

<script>
import {mapState} from 'vuex'
import DocsLayout from '@/layout/docsLayout'
import config from './config'

// markdownRender
export default {
  data() {
    return {
      config
    }
  },
  components: {
    DocsLayout
  },
  computed: {
    ...mapState({
      indexData: state => state.indexStore?.data
    })
  }
}
</script>

<style>

</style>
