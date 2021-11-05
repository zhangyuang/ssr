// The file is provisional，don't depend on it

import { createContext } from 'react'
import { IContext } from 'ssr-types-react'

declare const __isBrowser__: boolean

let STORE_CONTEXT

if (__isBrowser__ && !STORE_CONTEXT) {
  STORE_CONTEXT = createContext<IContext>({
    state: {}
  })
} else {
  STORE_CONTEXT = createContext<IContext>({
    state: {}
  })
}

export {
  STORE_CONTEXT
}
