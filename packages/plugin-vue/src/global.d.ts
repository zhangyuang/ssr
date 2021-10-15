import * as Router from 'vue-router'
import { IWindow } from 'ssr-types'

declare module '*.less'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
    __USE_VITE__?: boolean
    __VUE_ROUTER__?: Router
    __disableClientRender__?: boolean
  }
  const __isBrowser__: Boolean
}

