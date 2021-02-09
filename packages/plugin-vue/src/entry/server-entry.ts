import * as Vue from 'vue'
import { findRoute, getManifest, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IGlobal, IConfig } from 'ssr-types'
// import { createRouter, routes } from './router'

const layout = require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/components/layout/index.vue').default
const routes = [
  { path: '/', component: require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/index/render.vue').default },
  { path: '/detail/:id', component: require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/detail/render$id.vue').default }
]

// const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')
const feRoutes = routes

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
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

  const app = new Vue({
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
            slot: 'children',
            attrs: {
              id: 'app'
            }
          }, [h(routeItem.component as Vue.Component)]),
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
  return app
}

export default serverRender
