// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: async () => await import('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/index/render.vue') },
      { path: '/detail/:id', component: async () => await import('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/detail/render$id.vue') }
    ]
  })
}
