<template>
  <BaseLayout>
    Home
  </BaseLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import BaseLayout from '@/layout/baseLayout'

export default defineComponent({
  components: {
    BaseLayout
  },
  data () {
    return {
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
