import { IWindow } from 'ssr-types'

declare global {
  interface Window extends IWindow {}
  const __isBrowser__: Boolean
}
