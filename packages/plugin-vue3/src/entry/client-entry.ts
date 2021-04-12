import { h, createApp } from 'vue'
import { findRoute } from 'ssr-client-utils'
import { ESMFeRouteItem } from 'ssr-types'
import { createRouter } from './router'
import { createStore } from './store'

// @ts-expect-error
import feRoutes from 'ssr-temporary-routes'

declare const module: any

const clientRender = async () => {
  const store = createStore()
  const router = createRouter()

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }
  const App = await feRoutes[0].App()

  let layoutFetchData = {}
  let fetchData = {}
  const asyncData = {
    value: window.__INITIAL_DATA__ ?? {}
  }
  const app = createApp({
    render: () => h(App.default, {
      asyncData
    })
  })

  app.use(store)
  app.use(router)

  router.beforeResolve(async (to, from, next) => {
    // 找到要进入的组件并提前执行 fetch 函数
    const route = findRoute<ESMFeRouteItem>(feRoutes, to.path)
    let layoutFetchData = {}
    let fetchData = {}
    if (route.layoutFetch) {
      const fetchFn = await route.layoutFetch()
      layoutFetchData = await fetchFn.default({ store, router: to })
    }
    if (route.fetch) {
      const fetchFn = await route.fetch()
      fetchData = await fetchFn.default({ store, router: to })
    }
    asyncData.value = Object.assign(asyncData.value, layoutFetchData ?? {}, fetchData ?? {})

    next()
  })

  await router.isReady()

  if (!window.__USE_SSR__) {
    // 如果是 csr 模式 则需要客户端获取首页需要的数据
    const route = findRoute<ESMFeRouteItem>(feRoutes, location.pathname)
    const { fetch, layoutFetch } = route

    if (layoutFetch) {
      const fetchFn = await layoutFetch()
      layoutFetchData = await fetchFn.default({ store, router: router.currentRoute.value })
    }
    if (fetch) {
      const fetchFn = await fetch()
      fetchData = await fetchFn.default({ store, router: router.currentRoute.value })
    }
    asyncData.value = Object.assign(asyncData.value, layoutFetchData ?? {}, fetchData ?? {})
  }

  window.__VUE_APP__ = app
  window.__VUE_ROUTER__ = router

  app.mount('#app', !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false
  if (!window.__USE_VITE__) {
    module?.hot?.accept?.() // webpack 场景下的 hmr
  }
}

export default clientRender()
