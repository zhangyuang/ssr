
<template>
  <div class="swiperContainer">
    <swiper ref="mySwiper" :options="swiperOptions">
      <div v-for="val in data[0].itemMap" :key="val.img">
        <swiper-slide>
          <div class="sliderContainer">
            <img :src="val.img" class="carouselImg">
            <div class="sliderDescContainer">
              <span class="sliderTitle">
                {{ val.title }}
              </span>
            </div>
          </div>
        </swiper-slide>
      </div>
      <div slot="pagination" class="swiper-pagination" />
    </swiper>
  </div>
</template>

<script>

import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/swiper.less'

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
        // Some Swiper option/callback...
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  mounted () {
    console.log('Current Swiper instance object', this.swiper)
    this.swiper.slideTo(3, 1000, false)
  }
}
</script>

<style lang="less">
@import "./index.less";
</style>
