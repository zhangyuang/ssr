import Vue from 'vue'
import Vuex from 'vuex'
import { createRouter } from './router'

Vue.use(Vuex)
// @ts-expect-error
const store = require(vuexStoreFilePath) // define by webpack define plugin

function createStore () {
  return new Vuex.Store(store)
}

declare const module: any
const feRoutes = require('ssr-temporary-routes/route')
feRoutes.forEach(route => {
  route.component.fetch = route.fetch
})
const App = feRoutes[0].App
const clientRender = async () => {
  const store = createStore()
  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }

  const router = createRouter()
  router.onReady(() => {
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
      for (const component in activated) {
        if (component.fetch) {
          await component.fetch(store)
        }
      }
    })
  })
  if (!window.__USE_SSR__) {
    for (const component of router.getMatchedComponents(location.pathname)) {
      const { fetch } = component
      await fetch(store)
    }
  }
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App),
    store,
    router
  })
  app.$mount('#app', !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

export default clientRender()
