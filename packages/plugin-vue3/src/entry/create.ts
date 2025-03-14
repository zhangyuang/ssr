import { deepClone } from 'ssr-deepclone'
import type { Script } from 'ssr-types'
import { h } from 'vue'
import { createRouter as create, createMemoryHistory, createWebHashHistory, createWebHistory } from 'vue-router'
import { createStore as createVuexStore } from 'vuex'
import { RoutesType, VueRouterOptions } from '../types'
import { Routes } from './combine-router'

const { store, FeRoutes } = Routes as RoutesType

export function createRouter(options: VueRouterOptions & { hashRouter?: boolean; clientHistoryRouterMode?: 'webHistory' | 'memoryHistory' } = {}) {
	const { clientHistoryRouterMode, hashRouter, base = '/' } = options
	const useClientMemoryHistory = clientHistoryRouterMode === 'memoryHistory'
	const routerInstance = create({
		history: __isBrowser__ ? (hashRouter ? createWebHashHistory(base) : useClientMemoryHistory ? createMemoryHistory(base) : createWebHistory(base)) : createMemoryHistory(),
		routes: FeRoutes as any
	})
	if (__isBrowser__ && useClientMemoryHistory && window.ssrRequestPath) {
		routerInstance.push(window.ssrRequestPath)
		routerInstance.currentRoute.value.path = window.ssrRequestPath
	}
	return routerInstance
}

export function createStore() {
	return createVuexStore<any>(deepClone(store))
}

export const getInlineVNode = (arr: string[], type: 'style' | 'script', isVite: boolean) =>
	arr.map((item) =>
		h(type, {
			innerHTML: item,
			type: isVite ? 'module' : undefined
		})
	)

export const getVNode = (arr: Script) =>
	arr.map((item) =>
		h(
			item.tagName ?? 'script',
			Object.assign({}, item.describe, {
				innerHTML: item.content
			})
		)
	)
