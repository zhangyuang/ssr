// @ts-nocheck
// The file is provisional，don't depend on it

import { createContext } from 'react'
import { IContext } from 'ssr-types-react'
console.log('xxx', createContext)
let STORE_CONTEXT
if (__isBrowser__) {
  STORE_CONTEXT = window.STORE_CONTEXT ?? createContext<IContext>({
    state: {}
  })
  window.STORE_CONTEXT = STORE_CONTEXT
} else {
  STORE_CONTEXT = createContext<IContext>({
    state: {}
  })
}

export {
  STORE_CONTEXT
}
