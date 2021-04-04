
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'

import feRoutes from '~/ssr-temporary-routes/route'

export function createRouter () {
  return create({
    history: __isBrowser__ ? createWebHistory() : createMemoryHistory(),
    routes: feRoutes
  })
}
