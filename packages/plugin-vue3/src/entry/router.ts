
// @ts-nocheck

import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import { VueRouterOptions } from 'ssr-types'
import { FeRoutes } from 'ssr-temporary-routes'

export function createRouter (options: VueRouterOptions = {}) {
  const base = options.base || '/'
  return create({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    routes: FeRoutes
  })
}
