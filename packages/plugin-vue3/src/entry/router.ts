
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'

// @ts-expect-error
import feRoutes from 'ssr-temporary-routes'

export function createRouter () {
  return create({
    history: __isBrowser__ ? createWebHistory() : createMemoryHistory(),
    routes: feRoutes
  })
}
