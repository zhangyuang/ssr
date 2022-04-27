import { h, createSSRApp, createApp, reactive, renderSlot } from 'vue'
import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { findRoute } from 'ssr-client-utils'
import { createPinia } from 'pinia'
import { createRouter, createStore } from './create'
import { ESMFetch, IFeRouteItem, RoutesType } from './interface'
import { Routes } from './create-router'

const { FeRoutes, App, layoutFetch, PrefixRouterBase } = Routes as RoutesType
declare const module: any

let hasRender = false
async function getAsyncCombineData (fetch: ESMFetch | undefined, store: Store<any>, router: RouteLocationNormalizedLoaded) {
  const layoutFetchData = layoutFetch ? await layoutFetch({ store, router }) : {}
  let fetchData = {}

  if (fetch) {
    const fetchFn = await fetch()
    fetchData = await fetchFn.default({ store, router })
  }
  return Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
}

const clientRender = async () => {
  const store = createStore()
  const router = createRouter({
    base: (window.microApp && window.clientPrefix) ?? window.prefix ?? PrefixRouterBase,
    hashRouter: window.hashRouter
  })
  const pinia = createPinia()
  const create = window.__USE_SSR__ ? createSSRApp : createApp

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }
  if (window.__INITIAL_PINIA_DATA__) {
    pinia.state.value = window.__INITIAL_PINIA_DATA__
  }

  const asyncData = reactive({
    value: window.__INITIAL_DATA__ ?? {}
  })
  const reactiveFetchData = reactive({
    value: window.__INITIAL_DATA__ ?? {}
  })
  const fetchData = window.__INITIAL_DATA__ ?? {} // will be remove at next major version

  const app = create({
    render () {
      return renderSlot(this.$slots, 'default', {}, () => [h(App, {
        asyncData,
        fetchData,
        reactiveFetchData,
        ssrApp: app
      })])
    }
  })
  app.use(store)
  app.use(router)
  app.use(pinia)
  router.beforeResolve(async (to, from, next) => {
    if (hasRender || !window.__USE_SSR__) {
      // 找到要进入的组件并提前执行 fetch 函数
      const { fetch } = findRoute<IFeRouteItem>(FeRoutes, to.path)
      const combineAysncData = await getAsyncCombineData(fetch, store, to)
      to.matched?.forEach(item => {
        item.props.default = Object.assign({}, item.props.default ?? {}, {
          fetchData: combineAysncData
        })
      })
      reactiveFetchData.value = combineAysncData
      asyncData.value = Object.assign(asyncData.value, combineAysncData)
    }
    hasRender = true
    next()
  })
  await router.isReady()

  app.mount('#app', !!window.__USE_SSR__) // judge ssr/csr
  if (!window.__USE_VITE__) {
    module?.hot?.accept?.() // webpack hmr for vue jsx
  }
}

if (!window.__disableClientRender__) {
  // for micro front-end
  clientRender()
}

export {
  clientRender
}
