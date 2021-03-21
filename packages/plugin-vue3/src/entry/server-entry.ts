import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import * as Vuex from 'vuex'
import { createI18n } from 'vue-i18n'
import { findRoute, getManifest, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IConfig } from 'ssr-types'
import { createRouter } from './router'

const serialize = require('serialize-javascript')
// @ts-expect-error
const store = require(vuexStoreFilePath) // define by webpack define plugin

function createStore () {
  return Vuex.createStore(store)
}

const feRoutes = require('ssr-temporary-routes/route')

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const router = createRouter()
  const store = createStore()

  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, locale } = config
  const path = ctx.request.path // 这里取 pathname 不能够包含 queyString

  const routeItem = findRoute<FeRouteItem<{}, {
    App: Vue.Component
    layout: Vue.Component
  }>>(feRoutes, path)

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
  await router.isReady()

  if (!isCsr && fetch) {
    // csr 下不需要服务端获取数据
    await fetch({ store, router: router.currentRoute }, ctx)
  }
  const app = createSSRApp({
    render: function () {
      const injectCss: Vue.VNode[] = []
      dynamicCssOrder.forEach(css => {
        if (manifest[css]) {
          injectCss.push(h('link', {
            rel: 'stylesheet',
            href: manifest[css]
          }))
        }
      })

      const injectScript = jsOrder.map(js =>
        h('script', {
          src: manifest[js]
        })
      )

      return h(layout, { ctx, config }, {
        remInitial: () => h('script', {
          innerHTML: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"
        }),

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

        initialData: !isCsr ? () => h('script', {
          innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(store.state)}`
        }) : null,

        cssInject: () => injectCss,
        jsInject: () => injectScript
      }
      )
    }
  })
  if (locale.enable) {
    const i18n = createI18n({
      // 默认配置
      locale: 'en',
      messages: {},
      globalInjection: true,
      // 用户配置
      ...locale.config,
      // 模式锁定，传统模式SSR有bug
      legacy: false
    })
    app.use(i18n)
  }
  app.use(router)
  app.use(store)
  return app
}

export default serverRender
