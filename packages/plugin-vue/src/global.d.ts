import * as Router from 'vue-router'
import { IWindow } from 'ssr-types'

declare module '*.less'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    __USE_VITE__?: boolean
    __disableClientRender__?: boolean
    prefix?: string
    clientPrefix?: string
  }
  const __isBrowser__: Boolean
}

