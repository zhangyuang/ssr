
import { createRouter as create, createWebHistory, createMemoryHistory } from 'vue-router'

const feRoutes = require('ssr-temporary-routes/route')

export function createRouter () {
  return create({
    history: typeof document === 'undefined' ? createMemoryHistory() : createWebHistory(),
    routes: feRoutes
  })
}
