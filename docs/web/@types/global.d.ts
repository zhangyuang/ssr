import { IWindow } from 'ssr-types'

declare module '*.less'

declare global {
  interface Window {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
  }
  const __isBrowser__: Boolean
}
