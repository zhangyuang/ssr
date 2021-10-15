// @ts-nocheck
import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'

import { FeRoutes, store } from '_build/ssr-temporary-routes'
import { VueRouterOptions } from './interface'

// without tsconfig esModuleInterop options must use the compatible syntax
const RealVue = Vue.default || Vue
const RealRouter = Router.default || Router
const RealVuex = Vuex.default || Vuex

RealVue.use(RealRouter)
RealVue.use(RealVuex)

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
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
