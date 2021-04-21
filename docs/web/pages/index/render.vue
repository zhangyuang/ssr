<template>
  <BaseLayout>
    <div class="page-container">
      <section class="first-floor container weui-flex justify-align">
        <h1 class="title">{{ firstFloor.title }}</h1>
        <h2 class="desc">{{ firstFloor.desc }}</h2>
        <div class="media-wrapper weui-flex justify-align">
          <a class="link" :href="firstFloor.link.path">
            {{ firstFloor.link.label }}
          </a>
          <div class="img">
            <img :src="firstFloor.imgUrl" alt="" />
          </div>
        </div>
      </section>
      <div class="floor-container">
        <section class="second-floor container weui-felx justify-align">
          <h1 class="title">{{ secondFloor.title }}</h1>
          <div class="tip">
            <p>{{ secondFloor.content }}</p>
          </div>
          <div class="content weui-flex">
            <div
              class="weui-flex__item content-item"
              v-for="item in secondFloor.items"
              :key="item.title"
            >
              <div class="content__top weui-flex justify-align">
                <div class="icon weui-flex__item">
                  <img :src="item.icon" alt="" />
                </div>
                <div class="content-wrapper weui-flex__item">
                  <h3 class="title">{{ item.title }}</h3>
                  <p class="desc">{{ item.desc }}</p>
                </div>
              </div>
              <div class="content__bottom">
                <div
                  class="weui-flex__item"
                  v-for="(childContent, index) in item.children"
                  :key="`${childContent + index}`"
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
import { defineComponent } from "vue";
import { mapState } from "vuex";
import BaseLayout from "@/layout/baseLayout";
import { webSiteConfig } from "../../config/index";
// import bgImg from "./bg.webp";

export default defineComponent({
  components: {
    BaseLayout,
  },
  data() {
    return {
      firstFloor: webSiteConfig.home.firstFloor,
      secondFloor: webSiteConfig.home.secondFloor,
    };
  },
  computed: {
    ...mapState({
      indexData: (state) => state.indexStore?.data,
    }),
  },
});
</script>

<style scope lang="less">
@import "../../common.less";

.page-container {
  position: relative;
  width: 100%;
  height: auto;
  margin: 0 auto;
  font-family: sans-serif;
  color: #fff;
  text-align: center;

  /* margin: 0 auto;
    max-width: 1080px; */
  .first-floor {
    margin: 0 auto;
    padding: 100px 68px;
    flex-direction: row;
    flex-wrap: wrap;
    height: 983px;
    .title {
      font-size: 4.6rem;
      line-height: 7rem;
      font-weight: 600;
    }
    .media-wrapper {
      margin: 45px -15px -45px;
      text-align: center;
      z-index: 200;
      position: relative;
      .link {
        display: flex;
        height: 56px;
        border-radius: 28px;
        padding: 0px 20px;
        font-size: 1.7rem;
        background-color: rgb(4, 195, 142);
        color: rgb(255, 255, 255);
        text-decoration: none;
        align-self: center;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 3rem;
        border: 1px solid transparent;
        transition: background-color 0.3s cubic-bezier(0.6, 0.41, 0.47, 1.18) 0s,
          border-color 0.3s cubic-bezier(0.6, 0.41, 0.47, 1.18) 0s,
          color 0.3s cubic-bezier(0.6, 0.41, 0.47, 1.18) 0s;
        max-width: 100%;
        outline: none !important;
        box-sizing: border-box;
        &:hover {
          background-color: rgb(6, 136, 93);
          color: rgb(255, 255, 255);
          text-decoration: none;
        }
      }
      .img {
        margin-top: 45px;
        width: 100%;
        // height: 100%;
        background-color: rgb(124, 134, 142);
        border-radius: 4px;
        box-shadow: rgb(0 0 0) 0px 2px 40px;
        overflow: hidden;
      }
    }
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgb(22, 35, 50);
      z-index: -100;
      background-image: url(https://www.cypress.io/static/bca66aa…/dcf1d/cypress-header-bg.webp);
      opacity: 1;
    }
  }
  .floor-container {
    background-color: #f5f6f7;
  }
  .second-floor {
    position: relative;
    flex-direction: column;
    padding: 500px 36px 100px !important;
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
        flex-direction: row;
        flex-wrap: nowrap;
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
          margin-left: 24px;
          text-align: left;
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
        .weui-flex__item {
          text-align: left;
          margin-top: 18px;
        }
      }
    }
  }
}


/* 宽度小于等于414px */
@media screen and (max-width:414px ){
 .page-container  {
 .first-floor {
   padding: 20px 5px;
    .title {
      line-height: 1;
      font-size: 56px;
    }
    .media-wrapper {
      .img {
         width: 80%;
      }
    }
  }
  .second-floor {
    padding: 200px 5px 120px !important;
  }
 }

} 


@media screen and (min-width: 768px) {
  .first-floor,
  .second-floor {
    width: 750px;
  }

  .page-container .second-floor .content{
    flex-direction: column;
    flex-wrap: wrap;
  }
}

@media screen and (min-width: 991px) {
  .first-floor,
  .second-floor {
    width: 970px;
  }
  .page-container  .second-floor .content{
    flex-direction: row;
    flex-wrap: nowrap;
  }
}

@media screen and (min-width: 1200px) {
  .first-floor,
  .second-floor {
    width: 1100px;
  }
}





</style>
