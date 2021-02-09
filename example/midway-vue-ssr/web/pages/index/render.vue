
<template>
  <div>
    <!-- <Search></Search>
      {
        state?.indexData?.data?.[0]?.components ? <div>
          <Slider {...props} data={state.indexData.data[0].components} />
          <Rectangle {...props} data={state.indexData.data[1].components} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      } -->
    <button @click="addCount">
      button
    </button>
    {{ count }}
  </div>
</template>

<script>
// import Slider from '@/components/slider'
// import Rectangle from '@/components/rectangle'
// import Search from '@/components/search'
// export default {
//   name: 'Index',
//   components: {
//     Slider,
//     Rectangle,
//     Search
//   }
// }
export default {
  data () {
    return {
      count: 1
    }
  },
  created () {
    console.log('created')
  },
  mounted () {
    console.log('mounted')
  },
  methods: {
    addCount () {
      this.count++
    }
  }
}
</script>

<style>

</style>
