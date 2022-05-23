import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent, isMicro } from 'ssr-client-utils'
import { wrapComponent } from 'ssr-hoc-react'
import { IWindow, LayoutProps, ReactRoutesType } from 'ssr-types-react'
import { Routes } from './create-router'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App } = Routes as ReactRoutesType

declare const window: IWindow

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function (props: LayoutProps) {
    return props.children!
  }
  // 客户端渲染||hydrate
  const baseName = isMicro() ? window.clientPrefix : window.prefix
  const routes = await preloadComponent(FeRoutes, baseName)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter basename={baseName}>
      <AppContext>
        <Switch>
          <IApp>
            <Switch>
              {
                // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
                routes.map(item => {
                  const { fetch, component, path } = item
                  component.fetch = fetch
                  component.layoutFetch = layoutFetch
                  const WrappedComponent = wrapComponent(component)
                  return (
                    <Route exact={true} key={path} path={path} render={() => <WrappedComponent key={location.pathname}/>}/>
                  )
                })
              }
            </Switch>
          </IApp>
        </Switch>
      </AppContext>
    </BrowserRouter>
    , document.getElementById('app'))

}

clientRender()

export {
  clientRender
}
