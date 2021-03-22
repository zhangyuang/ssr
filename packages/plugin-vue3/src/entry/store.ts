import { createStore as createVuexStore } from 'vuex'

// @ts-expect-error
const store = require(vuexStoreFilePath) // define by webpack define plugin

function createStore () {
  return createVuexStore(store)
}

export {
  createStore
}
