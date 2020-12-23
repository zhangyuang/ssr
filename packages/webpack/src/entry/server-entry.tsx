import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { wrapLayout, FeRouteItem, findRoute, IFaaSContext, FaasRouteItem, Options, getStaticList, logGreen, IGlobal } from 'ssr-server-utils'
import { buildConfig } from '../config/config'

declare const __isBrowser__: boolean
declare const global: IGlobal
const { staticPrefix, cssOrder, jsOrder, isDev, devManifest } = buildConfig
const feRoutes: FeRouteItem[] = require('ssr-cache/route')

const serverRender = async (ctx: IFaaSContext, options: Options): Promise<React.ReactElement> => {
  const Context = React.createContext({})
  if (typeof global.window === 'undefined') {
    // 防止覆盖应用自己定义的 window 对象
    global.window = {}
  }
  global.window.STORE_CONTEXT = Context // 为每一个新的请求都创建一遍context并且覆盖window上的属性，使得无需通过props层层传递读取

  const routeItem = findRoute<FeRouteItem<any>>(feRoutes, ctx.req.path)
  const faasRouteItem = findRoute<FaasRouteItem>(options.faasRoutes, ctx.req.path)
  const { funcName, mode } = faasRouteItem

  const staticList = getStaticList(isDev, devManifest, staticPrefix, funcName, cssOrder, jsOrder)

  if (!routeItem) {
    throw new Error(`for request url ${ctx.req.path} Component is Not Found`)
  }

  const Layout = wrapLayout(routeItem.layout, __isBrowser__)
  const Component = routeItem.component

  if (mode !== 'ssr' || ctx.query?.csr) {
    logGreen(`The path ${ctx.req.path} use csr render mode`)
    // 根据mode和query来决定当前渲染模式
    return <StaticRouter><Layout ctx={ctx} staticList={staticList} config={buildConfig}></Layout></StaticRouter>
  }

  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}
  return <StaticRouter>
    <Context.Provider value={fetchData}>
      <Layout ctx={ctx} config={buildConfig} staticList={staticList}>
        <Component />
      </Layout>
    </Context.Provider>
  </StaticRouter>
}

export default serverRender
