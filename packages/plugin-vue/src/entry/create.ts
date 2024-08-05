import type { CreateElement } from 'vue'
import * as Vue from 'vue'
import * as Vuex from 'vuex'
import * as Router from 'vue-router'
import { deepClone } from 'ssr-deepclone'
import type { Script } from 'ssr-types'
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
  return new Vuex.Store<any>(deepClone(store))
}

export const getInlineVNode = (arr: string[], h: CreateElement, type: 'style'|'script') => arr.map(item => h(type, {
  domProps: {
    innerHTML: item
  }
}))

export const getVNode = (arr: Script, h: CreateElement) => arr.map(item => h(item.tagName ?? 'script', Object.assign({}, item.describe, {
  domProps: {
    innerHTML: item.content
  }
})))

export {
  createRouter,
  createStore,
  RealVue,
  RealRouter,
  RealVuex
}
