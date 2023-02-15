import { AsyncLocalStorage } from 'async_hooks'
import type { Readable } from 'stream'
import type { Pinia } from 'pinia'
import type { Context } from 'react'
import type { App } from 'vue'
import type { IContext } from 'ssr-types'

export interface StoreData {
  pinia?: Pinia
  store?: any
  context?: Context<IContext>
}
export interface AppStore {
  app?: App
}
type StorageReturnVal= Promise<string | Readable | NodeJS.ReadableStream | {
  html: string
  teleportsContext: any
}>
const localStorage = new AsyncLocalStorage<StoreData>()

export const localStorageWrapper = {
  run: async function (store: StoreData, callback: (args?: unknown) => StorageReturnVal) {
    const res = await localStorage.run(store, async function () {
      const res = await callback()
      return res
    })
    return res
  },
  getStore: () => localStorage.getStore()
}

const appLocalStoreage = new AsyncLocalStorage<AppStore>()

export const appLocalStoreageWrapper = {
  run: async function (store: AppStore, callback: (args?: unknown) => StorageReturnVal) {
    const res = await appLocalStoreage.run(store, async function () {
      const res = await callback()
      return res
    })
    return res
  },

  getStore: () => appLocalStoreage.getStore()
}

export const useStore = () => localStorage.getStore()?.store

export const usePinia = () => localStorage.getStore()?.pinia

export const useStoreContext = () => {
  return localStorageWrapper.getStore()?.context
}

export const useApp = () => appLocalStoreage.getStore()?.app
