import { IWindow } from 'ssr-types-react'

declare global {
  interface Window extends IWindow {}
  const __isBrowser__: Boolean
}
