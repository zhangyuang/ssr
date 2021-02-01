import Vue from 'vue'
import { wrapLayout, findRoute, getStaticList, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IGlobal, IConfig } from 'ssr-types'
import { createRouter } from './router'

const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')
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
    render: h => h(routeItem.component),
    router: createRouter()
  })
  return app
}

export default serverRender
