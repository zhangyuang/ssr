import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'
// @ts-expect-error
import { deepClone } from 'ssr-deepclone'
import { Routes } from './create-router'
import { VueRouterOptions } from '../types'
// without tsconfig esModuleInterop options must use the compatible syntax
const RealVue = Vue.default || Vue
const RealVuex = Vuex.default || Vuex
const RealRouter = Router.default || Router
RealVue.use(RealRouter as any)
RealVue.use(RealVuex)
const { FeRoutes, store } = Routes

function createRouter (options: VueRouterOptions = {}) {
  return new RealRouter({
    mode: 'history',
    routes: FeRoutes,
    base: options.base ?? '/'
  })
}

function createStore () {
  return new Vuex.Store(deepClone(store))
}

export {
  createRouter,
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
