<template>
  <div>
    123
  </div>
</template>

<script>
import {mapState} from 'vuex'

// markdownRender
export default {
  data() {
    return {
    }
  },
  components: {
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
