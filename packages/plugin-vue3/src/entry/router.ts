
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'

// const feRoutes = require('ssr-temporary-routes/route')
import feRoutes from './route'

export function createRouter () {
  return create({
    history: __isBrowser__ ? createWebHistory() : createMemoryHistory(),
    routes: feRoutes
  })
}
