import type { Pinia } from 'pinia'
import type { App } from 'vue'

const storeCache = {
  val: {
    store: {}
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

export const setStore = (store: any) => {
  storeCache.set(store)
}
export const useStore = () => {
  return storeCache.get()
}

export const setPinia = (pinia: Pinia) => {
  piniaCache.set(pinia)
}
export const usePinia = () => {
  return piniaCache.get()
}

export const setApp = (app: App) => {
  appCache.set(app)
}
export const useApp = () => {
  return appCache.get()
}
