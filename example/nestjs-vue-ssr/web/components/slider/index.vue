
<template>
  <div class="swiperContainer">
    <Swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="val in data[0].itemMap" :key="val.img" class="sliderContainer">
        <img :src="val.img" class="carouselImg" @click="toDetail">
        <div class="sliderDescContainer">
          <span class="sliderTitle">
            {{ val.title }}
          </span>
        </div>
      </swiper-slide>
      <template #pagination class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script lang="ts">

import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  props: ['data'],
  data () {
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          loop: true
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  mounted () {
    this.swiper.slideTo(2, 1000, false)
  },
  methods: {
    toDetail () {
      this.$router.push('/detail/cbba934b14f747049187')
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
