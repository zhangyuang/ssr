<template>
  <div class="header">
    <div class="header__left">
      <router-link class="logo" :to="`/`">
        <img src="/images/logo.jpeg" alt="" />
      </router-link>
    </div>
    <div class="nav">
      <div class="nav_left" />
      <searchBox />
      <router-link
        v-for="item in isMobile ? headerItems.slice(0, 3) : headerItems"
        :key="item.path"
        :to="item.path"
      >
        {{ item.label }}
      </router-link>
      <a target="_blank" href="https://github.com/zhangyuang/ssr">
        {{ t("header.github") }}
      </a>
      <a target="_blank" :href="`/${currentLanguage}/docs/features$sponsor`">
        {{ t("header.donation") }}
      </a>

      <!-- Language Switcher -->
      <div class="language-switcher" v-if="!isMobile">
        <div class="language-current" @click="toggleLanguageMenu">
          {{ getCurrentLanguageDisplay() }}
          <span class="language-arrow">▼</span>
        </div>
        <div class="language-menu" v-show="showLanguageMenu">
          <div
            v-for="lang in availableLanguages"
            :key="lang.code"
            class="language-option"
            :class="{ active: lang.code === currentLanguage }"
            @click="switchToLanguage(lang.code)"
          >
            {{ lang.nativeName }}
          </div>
        </div>
      </div>

      <a v-if="!isMobile" href="https://github.com/zhangyuang/ssr" target="_blank">
        <img
          src="https://img.shields.io/github/stars/zhangyuang/ssr.svg?color=000"
          alt="Node"
          style="width: 80px"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getWebSiteConfig } from "@/config/index";
import { getCurrentLanguage, t, switchLanguage, i18nConfig } from "@/config/i18n";
import searchBox from "../searchBox/index.vue";

export default defineComponent({
  components: {
    searchBox,
  },
  inject: ["asyncData"],
  data() {
    return {
      currentLanguage: getCurrentLanguage(),
      headerItems: [] as any[],
      isMobile: true,
      showLanguageMenu: false,
      availableLanguages: i18nConfig.languages,
    };
  },
  created() {
    const { isMobile } = this.asyncData.value;
    this.isMobile = isMobile;
    this.updateConfig();

    // Close language menu when clicking outside
    if (typeof window !== "undefined") {
      document.addEventListener("click", this.handleDocumentClick);
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      document.removeEventListener("click", this.handleDocumentClick);
    }
  },
  methods: {
    updateConfig() {
      const config = getWebSiteConfig(this.currentLanguage);
      this.headerItems = config.header.items;
    },
    t(key: string) {
      return t(key, this.currentLanguage);
    },
    getCurrentLanguageDisplay() {
      const lang = this.availableLanguages.find((l) => l.code === this.currentLanguage);
      return lang ? lang.nativeName : "English";
    },
    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu;
    },
    switchToLanguage(langCode: string) {
      if (langCode !== this.currentLanguage) {
        switchLanguage(langCode);
      }
      this.showLanguageMenu = false;
    },
    handleDocumentClick(event: Event) {
      const target = event.target as HTMLElement;
      const languageSwitcher = target.closest(".language-switcher");
      if (!languageSwitcher) {
        this.showLanguageMenu = false;
      }
    },
  },
});
</script>

<style scoped lang="less">
@import "../../common.less";
@import "./index.less";
</style>
