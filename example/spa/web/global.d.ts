import { IWindow } from 'ssr-types'
declare module '*.less'
declare module '@*'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
  }
}
declare const __isBrowser__: Boolean
