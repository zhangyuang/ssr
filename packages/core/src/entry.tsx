import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getWrappedComponent, getComponent, RouteItem, IFaaSContext, INodeModule, IWindow } from '@ssr/utils'

declare const window: IWindow
declare const module: INodeModule
declare const __isBrowser__: boolean

const clientRender = async (): Promise<void> => {
  // 客户端渲染||hydrate
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      <Switch>
        {
          // 使用高阶组件getWrappedComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
          routes.map((item: RouteItem) => {
            const activeComponent = item.Component()
            const Layout = activeComponent.Layout
            const WrappedComponent = getWrappedComponent(activeComponent)
            return <Route exact={item.exact} key={item.path} path={item.path} render={() => {
              return <Layout><WrappedComponent /></Layout>
            }} />
          })
        }
      </Switch>
    </BrowserRouter>
    , document.getElementById('app'))
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

const serverRender = async (ctx: IFaaSContext): Promise<JSX.Element> => {
  // 服务端渲染 根据ctx.path获取请求的具体组件，调用getInitialProps并渲染
  const ActiveComponent = getComponent(routes, ctx.path)()
  const Layout = ActiveComponent.Layout

  if (ctx.ssrConfig.type !== 'ssr') {
    return <Layout ctx></Layout>
  }
  const serverData = ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {}
  ctx.serverData = serverData
  return <Layout ctx>
      <ActiveComponent {...serverData} />
    </Layout>

}
export default __isBrowser__ ? clientRender() : serverRender
