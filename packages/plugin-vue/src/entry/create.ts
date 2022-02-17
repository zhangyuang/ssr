import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'

import { Routes } from './create-router'
import { VueRouterOptions } from './interface'
import { deepClone } from './clone'

// without tsconfig esModuleInterop options must use the compatible syntax
const RealVue = Vue.default || Vue
// @ts-expect-error
const RealRouter = Router.default || Router
const RealVuex = Vuex.default || Vuex

RealVue.use(RealRouter)
RealVue.use(RealVuex)

function createRouter (options: VueRouterOptions = {}): Router {
  return new RealRouter({
    mode: 'history',
    routes: Routes.FeRoutes,
    base: options.base ?? '/'
  })
}

function createStore () {
  return new Vuex.Store(deepClone(Routes.store) ?? {})
}

export {
  createRouter,
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
