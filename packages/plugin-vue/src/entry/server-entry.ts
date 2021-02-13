import * as Vue from 'vue'
import * as Vuex from 'vuex'
import { findRoute, getManifest, logGreen, getVuexStore } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IConfig } from 'ssr-types'
import * as serialize from 'serialize-javascript'
import { createRouter } from './router'

Vue.use(Vuex)

const store = getVuexStore()
function createStore () {
  return new Vuex.Store(store)
}

const feRoutes = require('ssr-temporary-routes/route')

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  return await new Promise(async (resolve, reject) => {
    const router = createRouter()
    const store = createStore()
    const { staticPrefix, cssOrder, jsOrder, dynamic, mode } = config
    const path = ctx.request.path // 这里取 pathname 不能够包含 queyString

    const routeItem = findRoute<FeRouteItem<any>>(feRoutes, path)
    let dynamicCssOrder = cssOrder
    if (dynamic) {
      dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    }
    const manifest = await getManifest()

    if (!routeItem) {
      throw new Error(`With request url ${path} Component is Not Found`)
    }
    const { fetch, layout, App } = routeItem
    if (fetch) {
      await fetch(store, ctx)
    }
    // 设置 router-view 展示的组件
    router.push(path)
    const app = new Vue({
      router,
      store,
      // 根实例简单的渲染应用程序组件。
      render: function (h: Vue.CreateElement) {
        const injectCss = dynamicCssOrder.map(css => (
          h('link', {
            attrs: {
              rel: 'stylesheet',
              href: `${staticPrefix}${manifest[css]}`
            }
          })
        ))
        const injectScript = jsOrder.map(js => (
          h('script', {
            attrs: {
              src: `${staticPrefix}${manifest[js]}`
            }
          })
        ))
        return h(
          layout,
          {},
          [
            h('template', {
              slot: 'remInitial'
            }, [
              h('script', {}, [
                "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"
              ])
            ]),
            h('template', {
              slot: 'children'
            }, [
              h(App)
            ]),
            h('template', {
              slot: 'initialData'
            }, [
              h('script', {
                domProps: {
                  innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(store.state)}`
                }
              })
            ]),
            h('template', {
              slot: 'cssInject'
            }, injectCss),
            h('template', {
              slot: 'jsInject'
            }, injectScript)
          ]
        )
      }
    })
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      resolve(app)
    })
  })
}

export default serverRender
