import { proxy } from 'valtio'
import { deepClone } from 'ssr-deepclone'
import { Routes } from './create-router'

const { store } = Routes

export function createStore (initialData?: any) {
  const storeInstance = initialData ? store : deepClone(store)
  for (const key in storeInstance) {
    storeInstance[key] = initialData ? proxy(initialData[key]) : proxy(storeInstance[key])
  }
  return storeInstance
}
