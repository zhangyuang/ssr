import * as Vue from 'vue'
import * as Router from 'vue-router'
import { findRoute, getManifest, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IConfig } from 'ssr-types'

Vue.use(Router)

const feRoutes = require('ssr-temporary-routes/route')
function createRouter () {
  return new Router({
    mode: 'history',
    routes: feRoutes
  })
}
const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  return await new Promise(async (resolve, reject) => {
    const router = createRouter()

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
    const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}
    const layout = routeItem.layout
    // 设置服务器端 router 的位置
    router.push(path)
    // 等到 router 将可能的异步组件和钩子函数解析完
    const app = new Vue({
      router,
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
              slot: 'cssInject'
            }, injectCss),
            h('template', {
              slot: 'jsInject'
            }, injectScript)
          ]
        )
      }
    })
    router.onReady(() => {
      resolve(app)
    })
  })
}

export default serverRender
