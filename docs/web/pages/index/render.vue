<template>
  <BaseLayout>
    <div class="page-container">
      <section class="first-floor container weui-flex justify-align">
        <h1 class="title">
          {{ firstFloor.title }}
        </h1>
        <h2 class="desc">
          {{ firstFloor.desc }}
        </h2>
        <div class="media-wrapper weui-flex justify-align">
          <div class="button-wrapper weui-flex justify-align">
            <router-link
              class="link start-button weui-flex__item"
              :to="firstFloor.startButton.path"
            >
              {{ firstFloor.startButton.label }}
            </router-link>
            <router-link
              class="link docs-button weui-flex__item"
              :to="firstFloor.docsButton.path"
            >
              {{ firstFloor.docsButton.label }}
            </router-link>
            <div class="license">
              License: MIT
              <a href="https://github.com/ykfe/ssr" target="_blank">Github</a>
            </div>
          </div>
        </div>
        <div class="swiper-container mySwiper">
          <div class="swiper-wrapper">
            <!-- <img class="swiper-slide" src="/images/material-2x.png" type="image/svg+xml"> -->
            <img class="swiper-slide" src="/images/resume3.svg" type="image/svg+xml">
            <img class="swiper-slide" src="/images/homecode3.svg" type="image/svg+xml">
            <img class="swiper-slide" src="/images/homecode4-1.svg" type="image/svg+xml">
          </div>
          <div class="swiper-button-next" />
          <div class="swiper-button-prev" />
        </div>
      </section>
      <div class="floor-container">
        <section class="second-floor container weui-felx justify-align">
          <h1 class="title">
            {{ secondFloor.title }}
          </h1>
          <div class="tip">
            <p>{{ secondFloor.content }}</p>
          </div>
          <div class="content weui-flex justify-align">
            <div
              v-for="item in secondFloor.items"
              :key="item.title"
              class="weui-flex__item content-item"
            >
              <div class="content__top weui-flex justify-align">
                <div class="content-wrapper weui-flex__item">
                  <h3 class="title">
                    {{ item.title }}
                  </h3>
                  <p class="desc">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
              <div class="content__bottom">
                <div
                  v-for="(childContent, index) in item.children"
                  :key="`${childContent + index}`"
                  class="weui-flex__item"
                >
                  {{ childContent }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </BaseLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import Swiper, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import BaseLayout from '@/layout/baseLayout/index.vue'
import { webSiteConfig } from '@/config/index'

// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Autoplay])

export default defineComponent({
  components: {
    BaseLayout
  },
  data () {
    return {
      firstFloor: webSiteConfig.home.firstFloor,
      secondFloor: webSiteConfig.home.secondFloor
    }
  },
  computed: {
    ...mapState({
      indexData: (state) => state.indexStore?.data
    })
  },

  mounted () {
    // eslint-disable-next-line
    const swiper = new Swiper('.mySwiper', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
      // autoplay: {
      //   delay: 2500
      // }
    })
  }
})
</script>

<style scope lang="less">
@import "@/common.less";
@import "./index.less";

.page-container {
  position: relative;
  width: 100%;
  font-family: sans-serif;
  color: #fff;
  text-align: center;

  /* margin: 0 auto;
    max-width: 1080px; */
  .first-floor {
    margin: 0 auto;
    padding: 100px 68px 0 68px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    box-sizing: border-box;
    .title {
      font-size: 100px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.05em;
    }
    .desc {
      font-size: 20px;
      letter-spacing: -0.02em;
    }
    .media-wrapper {
      // flex-direction: column;
      margin-top: 45px;
      text-align: center;
      z-index: 200;
      position: relative;
      .button-wrapper {
        flex-direction: row;
        position: relative;
        padding-bottom: 60px;
        .link {
          display: flex;
          height: 56px;
          border-radius: 8px;
          padding: 0px 56px;
          font-size: 1.7rem;
          background-color: #010101;
          color: rgb(255, 255, 255);
          text-decoration: none;
          align-self: center;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          line-height: 56px;
          transition: background-color 0.3s cubic-bezier(0.6, 0.41, 0.47, 1.18)
              0s,
            border-color 0.3s cubic-bezier(0.6, 0.41, 0.47, 1.18) 0s,
            color 0.3s cubic-bezier(0.6, 0.41, 0.47, 1.18) 0s;
          max-width: 100%;
          outline: none !important;
          box-sizing: border-box;
          &:hover {
            background-color: rgba(1, 1, 1, 0.9);
            color: rgb(255, 255, 255);
            box-shadow: 0 6px 20px rgba(93, 93, 93, 0.23);
            text-decoration: none;
          }
        }
        .docs-button {
          margin-left: 28px;
          background: #fff;
          color: #696969;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.23);

          &:hover {
            background: rgba(255, 255, 255, 0.9);
            color: #696969;
            box-shadow: 0 6px 20px rgba(93, 93, 93, 0.23);
          }
        }
        .license {
          position: absolute;
          bottom: 0px;
          font-size: 16px;
          a {
            color: rgb(144, 195, 234);
            text-decoration-color: rgb(144, 195, 234);
            text-decoration-line: none;
            text-decoration-style: solid;
            border-bottom-width: 1px;
            border-bottom-color: rgb(144, 195, 234);
            border-bottom-style: dashed;
          }
        }
      }

      // .img {
      //   margin-top: 45px;
      //   width: 100%;
      //   // height: 100%;
      //   background-color: rgb(124, 134, 142);
      //   border-radius: 4px;
      //   box-shadow: rgb(0 0 0) 0px 2px 40px;
      //   overflow: hidden;
      // }
    }
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #1b293c;
      z-index: -100;
      background-image: url("/images/header-bg.png");
      opacity: 1;
    }
  }
  .floor-container {
    background-color: #f5f6f7;
  }
  .second-floor {
    position: relative;
    flex-direction: column;
    padding: 200px 36px 100px !important;
    margin: 0 auto;
    min-height: 780px;
    background-color: rgb(245, 246, 247);
    color: #000;
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: red;
      z-index: -100;
      opacity: 1;
    }
    .tip {
      height: 93px;
      p {
        position: relative;
        margin-bottom: 98px;
        &::before {
          content: "";
          position: absolute;
          top: 58px;
          width: 100%;
          height: 1px;
          border-bottom: 2px solid rgb(124, 134, 142);
        }
      }
    }
    .content {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 100%;
      min-height: 418px;
      .content-item {
        max-width: 358px;
        background-color: #fff;
        border-radius: 15px;
        margin: 0 7px;
        margin-top: 10px;
        flex-wrap: wrap;
      }
      &__top {
        display: flex;
        justify-content: space-between;
        padding: 20px 30px;
        border-bottom: 2px solid rgb(124, 134, 142);

        .icon {
          // flex-basis: 33%;
          // max-width: 33%;
          img {
            width: 56px;
            min-width: 56px;
            border-radius: 50%;
          }
        }
        .content-wrapper {
          .title {
            font-weight: 700;
            line-height: 1;
          }
          .desc {
            font-size: 13px;
          }
        }
      }

      &__bottom {
        padding: 20px 25px;
        font-size: 14px;
        min-height: 180px;
        .weui-flex__item {
          text-align: left;
          margin-top: 18px;
        }
      }
    }
  }
}

/* 宽度小于等于414px */
@media screen and (max-width: 414px) {
  .page-container {
    .first-floor {
      padding: 20px;
      padding-top: 100px;
      height: auto;
      .title {
        line-height: 1;
        font-size: 48px;
      }
      .desc {
        font-size: 16px;
        font-weight: 400;
      }
      .media-wrapper {
        .button-wrapper {
          flex-direction: column;
          .docs-button {
            margin-left: 0;
            margin-top: 16px;
          }
        }
        .img {
          width: 80%;
        }
      }
    }
    .second-floor {
      padding: 100px 5px 120px !important;
      .content {
        flex-direction: column;
        flex-wrap: wrap;
        &__bottom {
          min-height: auto;
        }
      }
    }
  }
}

@media screen and (min-width: 414px) {
  .page-container .second-floor .content {
    flex-direction: column;
    flex-wrap: wrap;
     &__bottom {
       min-height: 180px;
    }
  }
}

@media screen and (min-width: 768px) {
  .first-floor,
  .second-floor {
    width: 750px;
  }

  .page-container .second-floor .content {
    flex-direction: column;
    flex-wrap: wrap;
     &__bottom {
       min-height: 180px;
    }
  }
}

@media screen and (min-width: 991px) {
  .first-floor,
  .second-floor {
    width: 970px;
  }
  .page-container .second-floor .content {
    flex-direction: row;
    flex-wrap: nowrap;
    &__top {
      min-height: 170px;
    }
  }
}

@media screen and (min-width: 1200px) {
  .page-container {
    .first-floor,
    .second-floor {
      width: 1100px;
    }
  }
}
</style>
