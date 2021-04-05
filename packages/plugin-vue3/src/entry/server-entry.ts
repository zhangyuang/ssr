import { resolve } from 'path'
import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import { findRoute, getManifest, logGreen, getCwd } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IConfig } from 'ssr-types'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import feRoutes from 'ssr-temporary-routes'
import { createRouter } from './router'
import { createStore } from './store'

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  const router = createRouter()
  const store = createStore()

  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, chunkName } = config
  const path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  const routeItem = findRoute<FeRouteItem<{}, {
    App: Vue.Component
    layout: Vue.Component
  }>>(feRoutes, path)
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

  const { fetch, layout, App } = routeItem
  router.push(path)
  await router.isReady()

  if (!isCsr && fetch) {
    // csr 下不需要服务端获取数据
    await fetch({ store, router: router.currentRoute }, ctx)
  }
  const app = createSSRApp({
    render: function () {
      const injectCss: Vue.VNode[] = []
      dynamicCssOrder.forEach(css => {
        if (manifest[css] || ViteMode) {
          injectCss.push(
            h('link', {
              rel: 'stylesheet',
              href: ViteMode ? `/server/static/css/${chunkName}.css` : manifest[css]
            })
          )
        }
      })

      const injectScript = ViteMode ? h('script', {
        type: 'module',
        src: resolve(getCwd(), '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js')
      }) : jsOrder.map((js) =>
        h('script', {
          src: manifest[js]
        })
      )
      return h(
        layout,
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
          }) : () => h(App),

          initialData: !isCsr ? () => h('script', { innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(store.state)};window.__USE_VITE__=${ViteMode}` })
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
