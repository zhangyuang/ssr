import { Store } from 'vuex'
import { Route } from 'vue-router'
import { findRoute } from 'ssr-client-utils'
import { Routes } from './create-router'
import { ESMFetch, RoutesType, IFeRouteItem } from './interface'
import { createRouter, createStore, RealVue } from './create'

declare const module: any
const { FeRoutes, App, layoutFetch, PrefixRouterBase } = Routes as RoutesType

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
    base: (window.microApp && window.clientPrefix) ?? window.prefix ?? PrefixRouterBase
  })

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }
  const fetchData = window.__INITIAL_DATA__ ?? {}

  const app = new RealVue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App, {
      props: {
        fetchData
      }
    }),
    store,
    // for type checker
    ...{
      router
    }
  })

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
    }
    hasRender = true
    next()
  })

  router.onReady(() => {
    app.$mount('#app', !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false
  })

  if (!window.__USE_VITE__) {
    module?.hot?.accept?.() // webpack 场景下的 hmr
  }
}

if (!window.__disableClientRender__) {
  // 如果服务端直出的时候带上该记号，则默认不进行客户端渲染，将处理逻辑交给上层
  // 可用于微前端场景下自定义什么时候进行组件渲染的逻辑调用
  clientRender()
}

export {
  clientRender
}
