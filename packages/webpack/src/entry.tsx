import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { wrapComponent, FeRouteItem, findRoute, IFaaSContext, IWindow, FaasRouteItem, Options } from 'ssr-client-utils'

declare const window: IWindow
declare const module: any
declare const __isBrowser__: boolean

const feRoutes: FeRouteItem[] = require('ssr-cache/route')

const clientRender = async (): Promise<void> => {
  // 客户端渲染||hydrate
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      <Switch>
        {
          // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
          feRoutes.map((item: FeRouteItem) => {
            const Layout = item.layout
            item.component.fetch = item.fetch
            const WrappedComponent = wrapComponent(item.component)
            return <Route exact={true} key={item.path} path={item.path} render={() => <Layout key={location.pathname}><WrappedComponent /></Layout>} />
          })
        }
      </Switch>
    </BrowserRouter>
    , document.getElementById('app'))
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

const serverRender = async (ctx: IFaaSContext, options: Options): Promise<React.ReactElement> => {
  const routeItem = findRoute<FeRouteItem>(feRoutes, ctx.req.path)
  const faasRouteItem = findRoute<FaasRouteItem>(options.faasRoutes, ctx.req.path)

  if (!routeItem) {
    throw new Error('Component is Not Found')
  }

  const Layout = routeItem.layout
  const Component = routeItem.component
  const mode = faasRouteItem.mode
  if (mode !== 'ssr') {
    return <Layout></Layout>
  }

  const fetchData = routeItem.fetch ? await routeItem.fetch(ctx) : {}
  const config = {
    injectCss: [
      `/static/css/Page.chunk.css`
    ], // 客户端需要加载的静态样式表
    injectScript: [
      `<script src='/static/js/runtime~Page.js'></script>`,
      `<script src='/static/js/vendor.chunk.js'></script>`,
      `<script src='/static/js/Page.chunk.js'></script>`
    ]
  }
  return <Layout ctx={ctx} fetchData={fetchData} config={config}>
      <Component {...fetchData} />
    </Layout>
}

export default __isBrowser__ ? clientRender() : serverRender
