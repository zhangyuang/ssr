import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { wrapLayout, FeRouteItem, findRoute, IFaaSContext, FaasRouteItem, Options, getStaticList, logGreen, IGlobal } from 'ssr-server-utils'
import { serverContext } from './create-context'
import { buildConfig } from '../config/config'

declare const global: IGlobal
const { staticPrefix, cssOrder, jsOrder, isDev, devManifest } = buildConfig
const feRoutes: FeRouteItem[] = require('ssr-cache/route')

const serverRender = async (ctx: IFaaSContext, options: Options): Promise<React.ReactElement> => {
  if (typeof global.window === 'undefined') {
    // 防止覆盖应用自己定义的 window 对象
    global.window = {}
  }

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
    const Context = serverContext(false) // csr 不需要在服务端获取数据
    global.window.STORE_CONTEXT = Context
    // 根据 mode 和 query 来决定当前渲染模式
    return <StaticRouter><Layout ctx={ctx} staticList={staticList} config={buildConfig}></Layout></StaticRouter>
  }

  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}
  const Context = serverContext(fetchData) // 服务端需要每个请求创建新的独立的 context
  global.window.STORE_CONTEXT = Context // 为每一个新的请求都创建一遍context并且覆盖window上的属性，使得无需通过props层层传递读取

  return <StaticRouter>
    <Context.Provider value={{ state: fetchData }}>
      <Layout ctx={ctx} config={buildConfig} staticList={staticList}>
        <Component />
      </Layout>
    </Context.Provider>
  </StaticRouter>
}

export default serverRender
