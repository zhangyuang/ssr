import { createStore as createVuexStore, Store, StoreOptions } from 'vuex'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'

const { store } = Routes as { store?: StoreOptions<any> }

let initStore: Store<any>

const createStore = () => {
  initStore = createVuexStore(store ?? {})
  return initStore
}

function useStore<T = any> () {
  return initStore as Store<T>
}

export {
  useStore,
  createStore
}
