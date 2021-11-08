// @ts-nocheck
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
import * as Routes from '_build/ssr-temporary-routes'

import { RoutesType, VueRouterOptions } from './interface'
import { deepClone } from './clone'

const { store, FeRoutes } = Routes as RoutesType

function createRouter (options: VueRouterOptions = {}) {
  const base = options.base ?? '/'
  return create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    routes: FeRoutes
  })
}

function createStore () {
  return createVuexStore(deepClone(store) ?? {})
}

export {
  createRouter,
  createStore
}
