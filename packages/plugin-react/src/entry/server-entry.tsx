import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { wrapLayout, findRoute, getStaticList, logGreen } from 'ssr-server-utils'
import { FeRouteItem, IFaaSContext, IGlobal } from 'ssr-types'
import { serverContext } from './create-context'

const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')
declare const global: IGlobal

const serverRender = async (ctx: IFaaSContext, config): Promise<React.ReactElement> => {
  const { staticPrefix, cssOrder, jsOrder, isDev, port, dynamic, mode } = config
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  const { window } = global
  const routeItem = findRoute<FeRouteItem<any>>(feRoutes, ctx.req.path)
  if (dynamic) {
    cssOrder.push(`${routeItem.webpackChunkName}.css`)
  }
  const staticList = await getStaticList(isDev, port, staticPrefix, cssOrder, jsOrder)

  if (!routeItem) {
    throw new Error(`With request url ${ctx.req.path} Component is Not Found`)
  }

  const Layout = wrapLayout(routeItem.layout, __isBrowser__)
  const Component = routeItem.component

  if (mode === 'csr' || mode === 'csr' || ctx.query?.csr) {
    // 根据 mode 和 query 来决定当前渲染模式
    logGreen(`The path ${ctx.req.path} use csr render mode`)
    const Context = serverContext({}) // csr 不需要在服务端获取数据
    window.STORE_CONTEXT = Context
    return <StaticRouter><Layout ctx={ctx} staticList={staticList} config={config}></Layout></StaticRouter>
  }

  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}
  const Context = serverContext(fetchData) // 服务端需要每个请求创建新的独立的 context
  window.STORE_CONTEXT = Context // 为每一个新的请求都创建一遍context并且覆盖window上的属性，使得无需通过props层层传递读取

  return (
    <StaticRouter>
      <Context.Provider value={{ state: fetchData }}>
        <Layout ctx={ctx} config={config} staticList={staticList}>
          <Component />
        </Layout>
      </Context.Provider>
    </StaticRouter>
  )
}

export default serverRender
