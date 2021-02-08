import * as Vue from 'vue'
import App from './app'

// import { wrapComponent, wrapLayout, FeRouteItem, preloadComponent } from 'ssr-client-utils'

declare const module: any

// const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')

const clientRender = async (): Promise<void> => {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App),
    router: createRouter()
  })
  router.onReady(() => {
    app.$mount('#app', app.$mount('#app', true)) // 这里需要做判断 ssr/csr 来为 true/false
  })
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

export default clientRender()
