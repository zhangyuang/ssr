// @ts-nocheck
import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'

import { FeRoutes, store } from 'ssr-temporary-routes'
import { VueRouterOptions } from './interface'

// without tsconfig esModuleInterop options must use the compatible syntax
const realVue: Vue = Vue.default || Vue
const RealRouter: Router = Router.default || Router
const RealVuex: Vuex = Vuex.default || Vuex

realVue.use(RealRouter)
realVue.use(RealVuex)

function createRouter (options: VueRouterOptions = {}): Router {
  return new RealRouter({
    mode: 'history',
    routes: FeRoutes,
    base: options.base ?? '/'
  })
}

function createStore () {
  return new Vuex.Store(store ?? {})
}

export {
  createRouter,
  createStore
}
