import * as Vue from 'vue'
import * as Router from 'vue-router'

Vue.use(Router)

export const routes = [
  { path: '/', component: async () => await import('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/index/render.vue') },
  { path: '/detail/:id', component: async () => await import('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/detail/render$id.vue') }
]
export function createRouter () {
  return new Router({
    mode: 'history',
    routes
  })
}

export const foo = 'foo'
