
// @ts-nocheck

import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'
import { FeRoutes } from 'ssr-temporary-routes'

export function createRouter () {
  return create({
    history: __isBrowser__ ? createWebHistory() : createMemoryHistory(),
    routes: FeRoutes
  })
}
