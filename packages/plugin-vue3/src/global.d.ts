import { IWindow } from 'ssr-types'
import { App } from 'vue'

declare module '*.less'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
    __VUE_APP__: App
    __USE_VITE__?: boolean
    __disableClientRender__?: boolean
    prefix?: string
  }
  var __VUE_PROD_DEVTOOLS__: boolean
  const __isBrowser__: Boolean
}
