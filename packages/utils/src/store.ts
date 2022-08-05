import type { Pinia } from 'pinia'
const storeCache = {
  val: {
    store: {}
  },
  setStore: function (store: any) {
    this.val.store = store
  },
  getStore: function () {
    return this.val.store
  }
}

const piniaCache = {
  val: {
    pinia: {} as Pinia
  },
  setPinia: function (pinia: Pinia) {
    this.val.pinia = pinia
  },
  getPinia: function () {
    return this.val.pinia
  }
}

export const setStore = (store: any) => {
  storeCache.setStore(store)
}
export const useStore = () => {
  return storeCache.getStore()
}

export const setPinia = (pinia: Pinia) => {
  piniaCache.setPinia(pinia)
}
export const usePinia = () => {
  return piniaCache.getPinia()
}
