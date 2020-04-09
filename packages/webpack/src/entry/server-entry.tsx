import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { buildConfig } from '../config'

import { wrapLayout, FeRouteItem, findRoute, IFaaSContext, FaasRouteItem, Options } from 'ssr-client-utils'

declare const __isBrowser__: boolean

const feRoutes: FeRouteItem[] = require('ssr-cache/route')

const serverRender = async (ctx: IFaaSContext, options: Options): Promise<React.ReactElement> => {

  const routeItem = findRoute<FeRouteItem<any>>(feRoutes, ctx.req.path)
  const faasRouteItem = findRoute<FaasRouteItem>(options.faasRoutes, ctx.req.path)
  if (!routeItem) {
    throw new Error('Component is Not Found')
  }

  const Layout = wrapLayout(routeItem.layout, __isBrowser__)
  const Component = routeItem.component
  const mode = faasRouteItem.mode
  if (mode !== 'ssr') {
    return <Layout></Layout>
  }
  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}

  return <StaticRouter>
    <Layout ctx={ctx} fetchData={fetchData} config={buildConfig}>
      <Component {...fetchData} />
    </Layout>
  </StaticRouter>
}

export default serverRender
