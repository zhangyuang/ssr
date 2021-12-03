// @ts-nocheck
// The file is provisional，don't depend on it

import React from 'react'
import { IContext } from 'ssr-types-react'
import ReactDOM from 'react-dom'
console.log(ReactDOM)
let STORE_CONTEXT
if (__isBrowser__) {
  STORE_CONTEXT = window.STORE_CONTEXT ?? React.createContext<IContext>({
    state: {}
  })
  window.STORE_CONTEXT = STORE_CONTEXT
} else {
  STORE_CONTEXT = React.createContext<IContext>({
    state: {}
  })
}

export {
  STORE_CONTEXT
}
