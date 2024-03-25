import { createContext } from 'react'
import type { Context } from 'react'
import type { IContext } from 'ssr-types'
import { proxy } from 'valtio'
import { deepClone } from 'ssr-deepclone'
import { combineRoutes } from 'ssr-common-utils'
import * as declareRoutes from '_build/ssr-declare-routes'
import * as ManualRoutes from '_build/ssr-manual-routes'
import { ReactRoutesType } from 'ssr-types'

export const Routes = combineRoutes(declareRoutes, ManualRoutes) as ReactRoutesType

export const ssrCreateContext = () => {
  let STORE_CONTEXT: Context<IContext>

  if (__isBrowser__) {
    STORE_CONTEXT = window.STORE_CONTEXT || createContext<IContext>({
      state: {}
    })
    window.STORE_CONTEXT = STORE_CONTEXT
    return STORE_CONTEXT
  } else {
    STORE_CONTEXT = createContext<IContext>({
      state: {}
    })
  }
  return STORE_CONTEXT
}

export function createStore (initialData?: any) {
  const { store } = Routes
  const storeInstance = initialData ? store : deepClone(store)
  for (const key in storeInstance) {
    storeInstance[key] = initialData ? proxy(initialData[key]) : proxy(storeInstance[key])
  }
  return storeInstance
}
