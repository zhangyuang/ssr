import * as Vue from 'vue'
import * as Vuex from 'vuex'
import { findRoute, getManifest, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IConfig } from 'ssr-types'
import { sync } from 'vuex-router-sync'
import { createRouter } from './router'

const serialize = require('serialize-javascript')
// @ts-expect-error
const store = require(vuexStoreFilePath) // define by webpack define plugin

function createStore () {
  return Vuex.createStore(store)
}

const feRoutes = require('ssr-temporary-routes/route')

const serverRender = async (
  ctx: ISSRContext,
  config: IConfig
): Promise<Vue.Component> => {
  // eslint-disable-next-line
  return await new Promise(async (resolve, reject) => {
    const router = createRouter()
    const store = createStore()
    // @ts-expect-error
    sync(store, router)

    const {
      staticPrefix,
      cssOrder,
      jsOrder,
      dynamic,
      mode,
      customeHeadScript
    } = config
    const path = ctx.request.path // 这里取 pathname 不能够包含 queyString

    const routeItem = findRoute<
    FeRouteItem<
    {},
    {
      App: Vue.Component
      layout: Vue.Component
    }
    >
    >(feRoutes, path)
    let dynamicCssOrder = cssOrder
    if (dynamic) {
      dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    }

    const manifest = await getManifest()

    if (!routeItem) {
      throw new Error(`With request url ${path} Component is Not Found`)
    }
    const isCsr = mode === 'csr' || ctx.request.query?.csr
    if (isCsr) {
      logGreen(`Current path ${path} use csr render mode`)
    }
    const { fetch, layout, App } = routeItem
    // 根据 path 匹配 router-view 展示的组件
    router.push(path)
    if (!isCsr && fetch) {
      // csr 下不需要服务端获取数据
      await fetch({ store, router: router.currentRoute }, ctx)
    }
    const app = Vue.createSSRApp({
      // 根实例简单的渲染应用程序组件。
      render: function () {
        const h = Vue.h
        const injectCss = dynamicCssOrder.map((css) =>
          h('link', {
            rel: 'stylesheet',
            href: `${staticPrefix}${manifest[css]}`
          })
        )
        const injectScript = jsOrder.map((js) =>
          h('script', {
            src: `${staticPrefix}${manifest[js]}`
          })
        )

        return h(
          layout,
          {
            // props: {
            ctx,
            config
            // },
          },
          {
            remInitial: () =>
              h('script', {
                innerHTML:
                  "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"
              }),
            customeHeadScript: () =>
              customeHeadScript?.map(
                (item) =>
                  h(
                    'script',
                    Object.assign({}, item.describe, {
                      innerHTML: item.content
                    })
                  )
                // )
              ),
            children: isCsr
              ? () =>
                h('div', {
                  // csr 只需渲染一个空的 <div id="app"> 不需要渲染具体的组件也就是 router-view
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
              : undefined,
            cssInject: () => injectCss,
            jsInject: () => injectScript
          }
        )
      }
    })
    app.use(router)
    app.use(store)
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.isReady().then(() => {
      resolve(app)
    })
  })
}

export default serverRender
