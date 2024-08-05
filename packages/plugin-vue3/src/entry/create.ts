import { h } from 'vue'
import { createRouter as create, createWebHistory, createMemoryHistory, createWebHashHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
import { deepClone } from 'ssr-deepclone'
import type { Script } from 'ssr-types'
import { Routes } from './combine-router'
import { RoutesType, VueRouterOptions } from '../types'

const { store, FeRoutes } = Routes as RoutesType

export function createRouter (options: VueRouterOptions&{hashRouter?: boolean} = {}) {
  const base = options.base ?? '/'
  const { hashRouter } = options
  return create({
    history: __isBrowser__ ? (hashRouter ? createWebHashHistory(base) : createWebHistory(base)) : createMemoryHistory(),
    routes: FeRoutes as any
  })
}

export function createStore () {
  return createVuexStore<any>(deepClone(store))
}

export const getInlineVNode = (arr: string[], type: 'style'|'script', isVite: boolean) => arr.map(item => h(type, {
  innerHTML: item,
  type: isVite ? 'module' : undefined
}))

export const getVNode = (arr: Script) => arr.map(item => h(item.tagName ?? 'script', Object.assign({}, item.describe, {
  innerHTML: item.content
})))
