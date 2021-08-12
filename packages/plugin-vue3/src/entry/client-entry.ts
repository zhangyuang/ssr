import { h, createApp, reactive } from 'vue'
import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { findRoute, normalizePath } from 'ssr-client-utils'
import { createRouter, createStore } from './create'
import { ESMFetch, IClientFeRouteItem, RoutesType } from './interface'

// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'

const { FeRoutes, App, layoutFetch, BASE_NAME } = Routes as RoutesType
declare const module: any

async function getAsyncCombineData (fetch: ESMFetch | undefined, store: Store<any>, router: RouteLocationNormalizedLoaded) {
  let layoutFetchData = {}
  let fetchData = {}
  if (layoutFetch) {
    layoutFetchData = await layoutFetch({ store, router })
  }
  if (fetch) {
    const fetchFn = await fetch()
    fetchData = await fetchFn.default({ store, router })
  }
  return Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
}

const clientRender = async () => {
  const store = createStore()
  const router = createRouter({
    base: BASE_NAME
  })

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }

  const asyncData = reactive({
    value: window.__INITIAL_DATA__ ?? {}
  })
  let fetchData = window.__INITIAL_DATA__ ?? {}
  const app = createApp({
    render: () => h(App, {
      asyncData,
      fetchData
    })
  })

  app.use(store)
  app.use(router)

  await router.isReady()
  router.beforeResolve(async (to, from, next) => {
    // 找到要进入的组件并提前执行 fetch 函数
    const { fetch } = findRoute<IClientFeRouteItem>(FeRoutes, to.path)
    const combineAysncData = await getAsyncCombineData(fetch, store, to)
    to.matched?.forEach(item => {
      item.props.default = Object.assign({}, item.props.default ?? {}, {
        fetchData: combineAysncData
      })
    })
    asyncData.value = Object.assign(asyncData.value, combineAysncData)
    next()
  })

  if (!window.__USE_SSR__) {
    // 如果是 csr 模式 则需要客户端获取首页需要的数据
    let pathname = location.pathname
    if (BASE_NAME) {
      pathname = normalizePath(pathname, BASE_NAME)
    }
    const { fetch } = findRoute<IClientFeRouteItem>(FeRoutes, pathname)
    const combineAysncData = await getAsyncCombineData(fetch, store, router.currentRoute.value)
    fetchData = combineAysncData
    asyncData.value = Object.assign(asyncData.value, combineAysncData)
  }

  window.__VUE_APP__ = app
  window.__VUE_ROUTER__ = router

  app.mount('#app', !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false
  if (!window.__USE_VITE__) {
    module?.hot?.accept?.() // webpack 场景下的 hmr
  }
}

export default clientRender()
