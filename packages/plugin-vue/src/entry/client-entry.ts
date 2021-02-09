import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// import { wrapComponent, wrapLayout, FeRouteItem, preloadComponent } from 'ssr-client-utils'

declare const module: any
const feRoutes = require('ssr-temporary-routes/route')

function createRouter () {
  return new Router({
    mode: 'history',
    routes: feRoutes
  })
}
// const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')

const clientRender = async (): Promise<void> => {
  const router = createRouter()
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(
      'div',
      {
        attrs: {
          id: 'app'
        }
      },
      [
        h('router-view')
      ]
    ),
    router
  })

  app.$mount('#app', true) // 这里需要做判断 ssr/csr 来为 true/false
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

export default clientRender()
