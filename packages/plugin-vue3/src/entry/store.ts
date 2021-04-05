import { createStore as createVuexStore } from 'vuex'

// @ts-expect-error
import * as store from '@/store/index.ts'

function createStore () {
  return createVuexStore(store)
}

export {
  createStore
}
