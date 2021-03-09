<template>
  <div class="swiperContainer">
    <!-- <Swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide
        v-for="val in data[0].itemMap"
        :key="val.img"
        class="sliderContainer"
      >
        <img :src="val.img" class="carouselImg" @click="toDetail" />
        <div class="sliderDescContainer">
          <span class="sliderTitle">
            {{ val.title }}
          </span>
        </div>
      </swiper-slide>
      <template #pagination class="swiper-pagination" />
    </Swiper> -->
    <swiper
      @swiper="onSwiper"
      :slidesPerView="3"
      :spaceBetween="50"
      navigation
      :scrollbar="{ draggable: true }"
      :pagination="{ clickable: true }"
    >
      <swiper-slide
        v-for="val in data[0].itemMap"
        :key="val.img"
        class="sliderContainer"
        @click="toDetail"
      >
        <img :src="val.img" class="carouselImg" />
        <div class="sliderDescContainer">
          <span class="sliderTitle">
            {{ val.title }}
          </span>
        </div>
      </swiper-slide>
      <template #pagination class="swiper-pagination" />
    </swiper>
  </div>
</template>

<script>
// import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  // directives: {
  //   swiper: directive,
  // },
  setup() {
    const onSwiper = (swiper) => {
      this.swiper = swiper;
    };
    return {
      onSwiper,
    };
  },
  props: ["data"],
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          loop: true,
        },
      },
    };
  },
  // computed: {
  //   swiper() {
  //     return this.$refs.mySwiper.$swiper;
  //   },
  // },
  mounted() {
    // this.swiper.slideTo(2, 1000, false);
  },
  methods: {
    toDetail() {
      console.log("teste");
      this.$router.push("/detail/cbba934b14f747049187");
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
