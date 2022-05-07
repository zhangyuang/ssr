import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'
// @ts-expect-error
import { deepClone } from 'ssr-deepclone'
import { Routes } from './create-router'
import { VueRouterOptions } from './interface'

// without tsconfig esModuleInterop options must use the compatible syntax
const RealVue = Vue.default || Vue
const RealVuex = Vuex.default || Vuex
const RealRouter = Router.default || Router
RealVue.use(RealRouter)
RealVue.use(RealVuex)
const { FeRoutes, modules } = Routes

function createRouter (options: VueRouterOptions = {}) {
  return new RealRouter({
    mode: 'history',
    routes: FeRoutes,
    base: options.base ?? '/'
  })
}

function createStore () {
  return new Vuex.Store(deepClone({
    modules: modules ?? {}
  }))
}

export {
  createRouter,
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
