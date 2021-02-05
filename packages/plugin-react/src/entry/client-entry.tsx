import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { FeRouteItem, preloadComponent } from 'ssr-client-utils'
import { wrapComponent, wrapLayout } from 'ssr-hoc-react'
import { IWindow } from 'ssr-types'
import { App } from './app'

declare const module: any
declare const window: IWindow
declare const __isBrowser__: boolean

const feRoutes: FeRouteItem[] = require('ssr-temporary-routes/route')

const clientRender = async (): Promise<void> => {
  // 客户端渲染||hydrate
  const routes = await preloadComponent(feRoutes)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      <App>
        <Switch>
          {
            // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
            routes.map((item: FeRouteItem) => {
              const { fetch, layout, component, path } = item
              const Layout = wrapLayout(layout, __isBrowser__)
              component.fetch = fetch
              const WrappedComponent = wrapComponent(component)
              return (
                <Route exact={true} key={path} path={path} render={() => <Layout key={location.pathname} >
                  <WrappedComponent />
                </Layout>}
                />
              )
            })
          }
        </Switch>
      </App>
    </BrowserRouter>
    , document.getElementById('app'))
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

export default clientRender()
