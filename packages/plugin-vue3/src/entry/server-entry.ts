import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import * as Vuex from 'vuex'
import { findRoute, getManifest, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IConfig } from 'ssr-types'
import { createRouter } from './router'
// import feRoutes from './route'

// const feRoutes = route
import feRoutes from 'ssr-temporary-routes/route'
// const feRoutes = require('ssr-temporary-routes')

const serialize = require('serialize-javascript')
// @ts-expect-error
const store = require(vuexStoreFilePath) // define by webpack define plugin

function createStore () {
  return Vuex.createStore(store)
}

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const router = createRouter()
  const store = createStore()

  const {
    cssOrder,
    jsOrder,
    dynamic,
    mode,
    customeHeadScript,
    isDev,
    viteDevMode
  } = config
  const path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  const routeItem = findRoute<FeRouteItem<{}, {
    App: Vue.Component
    layout: Vue.Component
  }>>(feRoutes, path)
  const ViteMode = isDev && viteDevMode

  let dynamicCssOrder = cssOrder
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
  }

  const manifest = await getManifest()

  if (!routeItem) {
    throw new Error(`With request url ${path} Component is Not Found`)
  }
  const isCsr = !!((mode === 'csr' || ctx.request.query?.csr))

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }

  const { fetch, layout, App } = routeItem
  router.push(path)

  if (!isCsr && fetch) {
    // csr 下不需要服务端获取数据
    await fetch({ store, router: router.currentRoute }, ctx)
  }
  const app = createSSRApp({
    render: function () {
      const injectCss: Vue.VNode[] = []
      dynamicCssOrder.forEach(css => {
        if (manifest[css]) {
          injectCss.push(
            h('link', {
              rel: 'stylesheet',
              href: ViteMode ? '/server/static/css/Page.css' : manifest[css]
            })
          )
        }
      })

      const injectScript = ViteMode
        ? h('script', {
          type: 'module',
          src:
              '/@fs/Users/jerry/github-project/prod/ssr/packages/plugin-vue3/esm/entry/client-entry.js'
        })
        : jsOrder.map((js) =>
          h('script', {
            src: manifest[js]
          })
        )
      return h(
        layout,
        { ctx, config },
        {
          remInitial: () =>
            h('script', {
              innerHTML:
                "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"
            }),
          viteClient: ViteMode
            ? () =>
              h('script', {
                type: 'module',
                src: '/@vite/client'
              })
            : null,
          customeHeadScript: () =>
            customeHeadScript?.map((item) =>
              h(
                'script',
                Object.assign({}, item.describe, {
                  innerHTML: item.content
                })
              )
            ),

          children: isCsr
            ? () =>
              h('div', {
                id: 'app'
              })
            : () => h(App),

          initialData: !isCsr
            ? () =>
              h('script', {
                innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(
                    store.state
                  )}`
              })
            : null,

          cssInject: () => injectCss,
          jsInject: () => injectScript
        }
      )
    }
  })
  app.use(router)
  app.use(store)
  await router.isReady()

  return app
}

export default serverRender
