import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { wrapLayout, FeRouteItem, findRoute, IFaaSContext, FaasRouteItem, Options, getStaticList } from 'ssr-server-utils'
import { buildConfig } from '../config/config'

declare const __isBrowser__: boolean
const { staticPrefix, cssOrder, jsOrder } = buildConfig
const feRoutes: FeRouteItem[] = require('ssr-cache/route')
const serverRender = async (ctx: IFaaSContext, options: Options): Promise<React.ReactElement> => {
  const routeItem = findRoute<FeRouteItem<any>>(feRoutes, ctx.req.path)
  const faasRouteItem = findRoute<FaasRouteItem>(options.faasRoutes, ctx.req.path)
  const { funcName, mode } = faasRouteItem
  const staticList = getStaticList(staticPrefix, funcName, cssOrder, jsOrder)
  if (!routeItem) {
    throw new Error('Component is Not Found')
  }

  const Layout = wrapLayout(routeItem.layout, __isBrowser__)
  const Component = routeItem.component
  if (mode !== 'ssr') {
    return <Layout config={buildConfig}></Layout>
  }

  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}
  return <StaticRouter>
    <Layout ctx={ctx} fetchData={fetchData} config={buildConfig} staticList={staticList}>
      <Component {...fetchData} />
    </Layout>
  </StaticRouter>
}

export default serverRender
