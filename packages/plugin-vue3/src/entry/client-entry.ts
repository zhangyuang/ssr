import { h, createSSRApp, createApp, reactive, renderSlot } from 'vue'
import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { findRoute } from 'ssr-client-utils'
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
    base: window.prefix ?? PrefixRouterBase
  })
  const create = window.__USE_SSR__ ? createSSRApp : createApp

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__)
  }

  const asyncData = reactive({
    value: window.__INITIAL_DATA__ ?? {}
  })
  const fetchData = window.__INITIAL_DATA__ ?? {}

  const app = create({
    render () {
      return renderSlot(this.$slots, 'default', {}, () => [h(App, {
        asyncData,
        fetchData
      })])
    }
  })
  app.use(store)
  app.use(router)

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
      asyncData.value = Object.assign(asyncData.value, combineAysncData)
    }
    hasRender = true
    next()
  })
  await router.isReady()

  app.mount('#app', !!window.__USE_SSR__) // 这里需要做判断 ssr/csr 来为 true/false
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
