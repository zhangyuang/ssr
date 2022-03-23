import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'
// @ts-expect-error
import { deepClone } from 'ssr-deepclone'
import { Routes } from './create-router'
import { VueRouterOptions } from './interface'
// without tsconfig esModuleInterop options must use the compatible syntax
const RealVue = Vue.default || Vue
// @ts-expect-error
const RealRouter = Router.default || Router
const RealVuex = Vuex.default || Vuex

RealVue.use(RealRouter)
RealVue.use(RealVuex)
const { FeRoutes, store } = Routes

function createRouter (options: VueRouterOptions = {}): Router {
  return new RealRouter({
    mode: 'history',
    routes: FeRoutes,
    base: options.base ?? '/'
  })
}

function createStore () {
  return new Vuex.Store(deepClone(store ?? {}))
}

export {
  createRouter,
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
