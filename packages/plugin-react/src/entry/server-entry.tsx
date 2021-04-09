import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { findRoute, getManifest, logGreen } from 'ssr-server-utils'
import { FeRouteItem, ISSRContext, IGlobal, IConfig } from 'ssr-types'
// @ts-expect-error
import feRoutes from 'ssr-temporary-routes'
import { serverContext } from './create-context'

declare const global: IGlobal

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  const { cssOrder, jsOrder, dynamic, mode } = config
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  const path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  const { window } = global
  const routeItem = findRoute<FeRouteItem<any>>(feRoutes, path)

  let dynamicCssOrder = cssOrder

  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
  }
  const manifest = await getManifest()

  const injectCss: JSX.Element[] = []
  dynamicCssOrder.forEach(css => {
    if (manifest[css]) {
      const item = manifest[css]
      injectCss.push(<link rel='stylesheet' key={item} href={item} />)
    }
  })

  const injectScript = jsOrder.map(js => manifest[js])
    .map(item => <script key={item} src={item} />)

  const staticList = {
    injectCss,
    injectScript
  }
  if (!routeItem) {
    throw new Error(`With request url ${path} Component is Not Found`)
  }

  const isCsr = !!((mode === 'csr' || ctx.request.query?.csr))
  const Layout = routeItem.layout
  const Component = routeItem.component
  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }
  const layoutFetchData = (!isCsr && routeItem.layoutFetch) ? await routeItem.layoutFetch(ctx) : false
  const fetchData = (!isCsr && routeItem.fetch) ? await routeItem.fetch(ctx) : false
  const combineData = isCsr ? false : Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
  const Context = serverContext(combineData) // 服务端需要每个请求创建新的独立的 context
  window.STORE_CONTEXT = Context // 为每一个新的请求都创建一遍 context 并且覆盖 window 上的属性，使得无需通过props层层传递读取

  return (
    <StaticRouter>
      <Context.Provider value={{ state: combineData }}>
        <Layout ctx={ctx} config={config} staticList={staticList}>
          {isCsr ? <></> : <Component />}
        </Layout>
      </Context.Provider>
    </StaticRouter>
  )
}

export default serverRender
