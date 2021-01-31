import * as Vue from 'vue'
import { wrapLayout, findRoute, getStaticList, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IGlobal, IConfig } from 'ssr-types'
// import { createRouter, routes } from './router'
import * as Router from 'vue-router'

Vue.use(Router)

const layout = require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/components/layout/index.vue').default
const routes = [
  { path: '/', component: require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/index/render.vue').default },
  { path: '/detail/:id', component: require('/Users/yuuang/Desktop/github/ssr/example/midway-vue-ssr/web/pages/detail/render$id.vue').default }
]
function createRouter () {
  return new Router({
    mode: 'history',
    routes
  })
}

// const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')
const feRoutes = routes
declare const global: IGlobal
declare const __isBrowser__: boolean

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  const { staticPrefix, cssOrder, jsOrder, isDev, fePort, dynamic, mode } = config
  const path = ctx.request.path // 这里取 pathname 不能够包含 queyString

  const routeItem = findRoute<FeRouteItem<any>>(feRoutes, path)
  let dynamicCssOrder = cssOrder
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
  }
  const staticList = await getStaticList(isDev, fePort, staticPrefix, dynamicCssOrder, jsOrder)

  if (!routeItem) {
    throw new Error(`With request url ${path} Component is Not Found`)
  }

  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}

  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(
      layout,
      {
        props: {
          foo: routeItem.component
        }
      },
      routeItem.component
    ),
    router: createRouter()
  })
  return app
}

export default serverRender
