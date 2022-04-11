<template>
  <div class="swiperContainer">
    <Swiper ref="mySwiper">
      <swiper-slide v-for="val in data[0].itemMap" :key="val.img" class="sliderContainer" @click="toDetail">
        <img :src="val.img" class="carouselImg">
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

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { ItemMapArr } from '~/typings/data'
import 'swiper/swiper-bundle.css'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Swiper as SwiperCore, Autoplay, Pagination } from 'swiper'
import 'swiper/components/pagination/pagination.less'
const Router = useRouter()
SwiperCore.use([Autoplay, Pagination])
defineProps<{
  data: ItemMapArr[]
}>()
const toDetail = () => {
  Router.push('/detail/cbba934b14f747049187')
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
