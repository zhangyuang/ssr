import { IWindow } from 'ssr-types'
import { App } from 'vue'
import { Router } from 'vue-router'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
    __VUE_ROUTER__: Router
    __VUE_APP__: App
  }
  const __isBrowser__: Boolean
}
