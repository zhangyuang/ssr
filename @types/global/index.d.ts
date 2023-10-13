interface IWindow {
  __USE_SSR__?: boolean
  __INITIAL_DATA__?: any
  __INITIAL_PINIA_DATA__?: any
  STORE_CONTEXT?: any
  __USE_VITE__?: boolean
  prefix?: string
  clientPrefix?: string
  microApp?: any
  hashRouter: boolean
  ssrDevInfo: any
  __VALTIO_DATA__?: any
}

declare global {
  interface Window extends IWindow {}
  var __non_webpack_require__: NodeRequire
  var __VUE_PROD_DEVTOOLS__: boolean
  var __isBrowser__: Boolean
}



declare module '*.less'

export {}