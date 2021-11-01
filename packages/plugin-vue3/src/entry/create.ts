
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import * as vuex from 'vuex'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'

import { RoutesType, VueRouterOptions } from './interface'

const { store, FeRoutes } = Routes as RoutesType

function createRouter (options: VueRouterOptions = {}) {
  const base = options.base ?? '/'
  return create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    // @ts-expect-error
    routes: FeRoutes
  })
}

function createStore () {
  console.log('xxx', vuex)
  return vuex.createStore(store ?? {})
}

export {
  createRouter,
  createStore
}
