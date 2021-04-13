<template>
  <DocsLayout :config="config" />
</template>

<script lang="ts">
import { mapState } from 'vuex'
import DocsLayout from '@/layout/docsLayout/index'
import config from './config'

export default {
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
}
</script>

<style>

</style>
