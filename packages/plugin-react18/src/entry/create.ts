import { createContext } from 'react'
import type { IContext } from 'ssr-types'
import { proxy } from 'valtio'
import { deepClone } from 'ssr-deepclone'
import { combineRoutes } from 'ssr-common-utils'
import * as declareRoutes from '_build/ssr-declare-routes'
import * as ManualRoutes from '_build/ssr-manual-routes'
import { ReactRoutesType } from 'ssr-types'

export const Routes = combineRoutes(declareRoutes, ManualRoutes) as ReactRoutesType

export const ssrCreateContext = () => {
  const context = createContext<IContext>({
    state: {}
  })
  if (__isBrowser__) {
    window.STORE_CONTEXT = context
  }
  return context
}

export function createStore (initialData?: any) {
  const { store } = Routes
  const storeInstance = initialData ? store : deepClone(store)
  for (const key in storeInstance) {
    storeInstance[key] = initialData ? proxy(initialData[key]) : proxy(storeInstance[key])
  }
  return storeInstance
}
