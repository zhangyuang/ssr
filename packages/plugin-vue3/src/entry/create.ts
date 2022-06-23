// @ts-nocheck
import { createRouter as create, createWebHistory, createMemoryHistory, createWebHashHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
import { deepClone } from 'ssr-deepclone'
import { Routes } from './combine-router'
import { RoutesType, VueRouterOptions } from './interface'

const { store, FeRoutes } = Routes as RoutesType
function createRouter (options: VueRouterOptions&{hashRouter: boolean} = {}) {
  const base = options.base ?? '/'
  const { hashRouter } = options
  return create({
    history: __isBrowser__ ? (hashRouter ? createWebHashHistory(base) : createWebHistory(base)) : createMemoryHistory(),
    routes: FeRoutes
  })
}

function createStore () {
  return createVuexStore(deepClone(store))
}

export {
  createRouter,
  createStore
}
