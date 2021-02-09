import Vue from 'vue'
import Router from 'vue-router'

// import { wrapComponent, wrapLayout, FeRouteItem, preloadComponent } from 'ssr-client-utils'

declare const module: any

const routes = [
  { path: '/', component: require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/index/render.vue').default },
  { path: '/detail/:id', component: require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/detail/render$id.vue').default }
]
function createRouter () {
  return new Router({
    mode: 'history',
    routes
  })
}
// const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')

const clientRender = async (): Promise<void> => {
  const router = createRouter()
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/index/render.vue').default),
    router
  })

  app.$mount('#app', true) // 这里需要做判断 ssr/csr 来为 true/false
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

export default clientRender()
