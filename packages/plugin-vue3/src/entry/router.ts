
import {
  createRouter as create,
  createWebHistory,
  createMemoryHistory
} from 'vue-router'

// realVue.use(RealRouter)

const feRoutes = require('ssr-temporary-routes/route')

export function createRouter (): any {
  return create({
    history: typeof window === 'undefined' ? createMemoryHistory() : createWebHistory(),
    routes: feRoutes
  })
}
