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

export const setStore = (store: any) => {
  storeCache.setStore(store)
}
export const useStore = (store: any) => {
  return storeCache.getStore()
}
