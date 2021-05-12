// @ts-nocheck
import * as Vue from 'vue'
import * as Router from 'vue-router'
import { VueRouterOptions } from 'ssr-types'

import { FeRoutes } from 'ssr-temporary-routes'

const realVue: Vue = Vue.default || Vue
const RealRouter: Router = Router.default || Router

realVue.use(RealRouter)

export function createRouter (options: VueRouterOptions = {}): Router {
  return new RealRouter({
    mode: 'history',
    routes: FeRoutes,
    base: options.base || '/'
  })
}
