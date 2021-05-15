import { IWindow } from 'ssr-types'
import { App } from 'vue'
import { Router } from 'vue-router'

declare module '*.less'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
    __VUE_APP__: App
    __VUE_ROUTER__?: Router
    __USE_VITE__?: boolean
  }
  const __isBrowser__: Boolean
}

