import { CreateElement } from 'vue'
import { Store } from 'vuex'
import { Route } from 'vue-router'
import { findRoute, isMicro, setStore } from 'ssr-common-utils'
import { Routes } from './create-router'
import { ESMFetch, IFeRouteItem } from '../types'
import { createRouter, createStore, RealVue } from './create'

const { FeRoutes, App, layoutFetch } = Routes

let hasRender = false
async function getAsyncCombineData (fetch: ESMFetch | undefined, store: Store<any>, router: Route) {
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
    base: isMicro() ? window.clientPrefix : window.prefix
  })
  setStore(store)
  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }
  const fetchData = window.__INITIAL_DATA__ ?? {}
  const reactiveFetchData = {
    value: window.__INITIAL_DATA__ ?? {}
  }
  const asyncData = {
    value: window.__INITIAL_DATA__ ?? {}
  }
  const params = {
    render: (h: CreateElement) => h('div', {
      attrs: {
        id: window.ssrDevInfo.rootId.replace('#', '')
      }
    }, [h(App, {
      props: {
        fetchData,
        reactiveFetchData,
        asyncData
      }
    })]),
    store,
    router
  }
  const app = new RealVue(params)

  router.beforeResolve(async (to, from, next) => {
    // 找到要进入的组件并提前执行 fetch 函数
    if (hasRender || !window.__USE_SSR__) {
      const route = findRoute<IFeRouteItem>(FeRoutes, to.path)
      const { fetch } = route
      const combineAysncData = await getAsyncCombineData(fetch, store, to)
      to.matched?.forEach(item => {
        item.props = Object.assign({}, item.props ?? {}, {
          fetchData: combineAysncData
        })
      })
      reactiveFetchData.value = combineAysncData
      asyncData.value = Object.assign(asyncData.value, combineAysncData)
    }
    hasRender = true
    next()
  })

  router.onReady(() => {
    app.$mount(window.ssrDevInfo.rootId, !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false
  })
}

clientRender()

export {
  clientRender
}
