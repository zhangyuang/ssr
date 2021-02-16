import Vue from 'vue'
import Vuex from 'vuex'
import { preloadComponent } from 'ssr-client-utils'
import { createRouter } from './router'

Vue.use(Vuex)
// @ts-expect-error
const store = require(vuexStoreFilePath) // define by webpack define plugin

function createStore () {
  return new Vuex.Store(store)
}

declare const module: any
let feRoutes = require('ssr-temporary-routes/route')

const App = feRoutes[0].App
const clientRender = async () => {
  feRoutes = await preloadComponent(feRoutes)
  feRoutes.forEach(route => {
    route.component.fetch = route.fetch
  })
  const store = createStore()
  const router = createRouter()

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }

  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App),
    store,
    router
  })
  if (!window.__USE_SSR__) {
    // 如果是 csr 模式 则需要客户端获取首页需要的数据
    for (const component of router.getMatchedComponents(location.pathname)) {
      const { fetch } = component
      await fetch({ store, router })
    }
  }
  router.beforeResolve(async (to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }
    for (const component of activated) {
      if (component.fetch) {
        await component.fetch({ store, router: to })
      }
    }
    next()
  })
  app.$mount('#app', !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

export default clientRender()
