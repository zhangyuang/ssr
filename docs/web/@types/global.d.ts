import { IWindow } from 'ssr-types'

declare module '*.less'

declare global {
  interface Window extends IWindow {}
  const __isBrowser__: Boolean
}
