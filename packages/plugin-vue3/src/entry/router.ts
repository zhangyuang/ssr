// @ts-nocheck
// import * as Vue from 'vue'
import {
  createRouter as create,
  createWebHistory,
  Router,
  createMemoryHistory
} from 'vue-router'

const feRoutes = require('ssr-temporary-routes/route')

export function createRouter (): Router {
  return create({
    history:
      typeof window === 'undefined'
        ? createMemoryHistory()
        : createWebHistory(),
    routes: feRoutes
  })
}
