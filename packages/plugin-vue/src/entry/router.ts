import * as Vue from 'vue'
import * as Router from 'vue-router'

const realVue: Vue = Vue.default || Vue
const RealRouter: Router = Router.default || Router

realVue.use(RealRouter)

const feRoutes = require('ssr-temporary-routes/route')

export function createRouter () {
  return new RealRouter({
    mode: 'history',
    routes: feRoutes
  })
}
