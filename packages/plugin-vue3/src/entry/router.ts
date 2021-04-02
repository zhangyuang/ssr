
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'

// import feRoutes from 'ssr-temporary-routes'
// import feRoutes from './route'
// const feRoutes = require('ssr-temporary-routes')
import feRoutes from '~/ssr-temporary-routes/route'

export function createRouter () {
  return create({
    history: __isBrowser__ ? createWebHistory() : createMemoryHistory(),
    routes: feRoutes
  })
}
