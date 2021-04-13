<template>
  <div>
    blog
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'

// markdownRender
export default {
  components: {
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
}
</script>

<style>

</style>
