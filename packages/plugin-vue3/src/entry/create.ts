// @ts-nocheck
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
import { Routes } from './create-router'
import { deepClone } from './clone'
import { RoutesType, VueRouterOptions } from './interface'

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
