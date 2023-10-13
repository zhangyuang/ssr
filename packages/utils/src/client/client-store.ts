import type { Pinia } from 'pinia'
import type { App } from 'vue'
import type { Context } from 'react'
import type { IContext } from 'ssr-types'

const storeCache = {
  val: {
    store: {} as any
  },
  set: function (store: any) {
    this.val.store = store
  },
  get: function () {
    return this.val.store
  }
}

const piniaCache = {
  val: {
    pinia: {} as Pinia
  },
  set: function (pinia: Pinia) {
    this.val.pinia = pinia
  },
  get: function () {
    return this.val.pinia
  }
}

const appCache = {
  val: {
    app: {} as App
  },
  set: function (app: App) {
    this.val.app = app
  },
  get: function () {
    return this.val.app
  }
}

const contextCache = {
  val: {
    obj: {} as Context<IContext>
  },
  set: function (app: Context<IContext>) {
    this.val.obj = app
  },
  get: function () {
    return this.val.obj
  }
}

export const setStore = (store: any) => {
  storeCache.set(store)
}
export const useStore = <T = any >(): T => {
  return storeCache.get()
}

export const setPinia = (pinia: Pinia) => {
  piniaCache.set(pinia)
}
export const usePinia = () => {
  return piniaCache.get()
}

export const useCtx = () => {
  console.warn('useCtx can only be used on the server side')
  return {}
}

export const setApp = (app: App) => {
  appCache.set(app)
}
export const useApp = () => {
  return appCache.get()
}

export const setStoreContext = (context: Context<IContext>) => {
  contextCache.set(context)
}
export const useStoreContext = () => {
  return contextCache.get()
}
