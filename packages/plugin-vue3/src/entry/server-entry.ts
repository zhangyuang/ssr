import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import { findRoute, getManifest, logGreen, normalizePath } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from 'ssr-temporary-routes'
import { IServerFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const { FeRoutes, App, layoutFetch, Layout, BASE_NAME } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  // @ts-expect-error
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ ?? false
  const router = createRouter()
  let path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  if (BASE_NAME) {
    path = normalizePath(path)
  }
  const store = createStore()
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, chunkName } = config
  const routeItem = findRoute<IServerFeRouteItem>(FeRoutes, path)
  const ViteMode = process.env.BUILD_TOOL === 'vite'

  let dynamicCssOrder = cssOrder
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
  }

  const manifest = ViteMode ? {} : await getManifest()

  if (!routeItem) {
    throw new Error(`With request url ${path} Component is Not Found`)
  }
  const isCsr = !!((mode === 'csr' || ctx.request.query?.csr))

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }

  const { fetch } = routeItem
  router.push(path)
  await router.isReady()

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    // csr 下不需要服务端获取数据
    if (layoutFetch) {
      layoutFetchData = await layoutFetch({ store, router: router.currentRoute.value }, ctx)
    }
    if (fetch) {
      fetchData = await fetch({ store, router: router.currentRoute.value }, ctx)
    }
  }

  const asyncData = {
    value: Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
  }

  const injectCss: Vue.VNode[] = []
  if (ViteMode) {
    injectCss.push(
      h('link', {
        rel: 'stylesheet',
        href: `/server/static/css/${chunkName}.css`
      })
    )
  } else {
    dynamicCssOrder.forEach(css => {
      if (manifest[css]) {
        injectCss.push(
          h('link', {
            rel: 'stylesheet',
            href: manifest[css]
          })
        )
      }
    })
  }

  const injectScript = ViteMode ? h('script', {
    type: 'module',
    src: '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'
  }) : jsOrder.map(js =>
    h('script', {
      src: manifest[js]
    })
  )
  const state = Object.assign({}, store.state ?? {}, asyncData.value)

  const app = createSSRApp({
    render: function () {
      return h(
        Layout,
        { ctx, config },
        {
          remInitial: () => h('script', { innerHTML: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'" }),

          viteClient: ViteMode ? () =>
            h('script', {
              type: 'module',
              src: '/@vite/client'
            }) : null,

          customeHeadScript: () => customeHeadScript?.map((item) =>
            h(
              'script',
              Object.assign({}, item.describe, {
                innerHTML: item.content
              })
            )
          ),

          children: isCsr ? () => h('div', {
            id: 'app'
          }) : () => h(App, { asyncData }),

          initialData: !isCsr ? () => h('script', { innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${ViteMode}` })
            : () => h('script', { innerHTML: `window.__USE_VITE__=${ViteMode}` }),

          cssInject: () => injectCss,

          jsInject: () => injectScript
        }
      )
    }
  })

  app.use(router)
  app.use(store)
  await router.isReady()

  window.__VUE_APP__ = app
  return app
}

export default serverRender
