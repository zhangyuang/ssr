import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent } from 'ssr-client-utils'
import { wrapComponent } from 'ssr-hoc-react'
import { IWindow, LayoutProps, ReactESMFeRouteItem, ReactRoutesType } from 'ssr-types-react'
import { Routes } from './create-router'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App, PrefixRouterBase } = Routes as ReactRoutesType

declare const module: any
declare const window: IWindow

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function (props: LayoutProps) {
    return props.children!
  }
  // 客户端渲染||hydrate
  const baseName = (window.microApp && window.clientPrefix) ?? window.prefix ?? PrefixRouterBase
  const routes = await preloadComponent(FeRoutes, baseName)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter basename={baseName}>
      <AppContext>
        <Switch>
          <IApp>
            <Switch>
              {
                // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
                routes.map((item: ReactESMFeRouteItem) => {
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

  if (!window.__USE_VITE__) {
    module?.hot?.accept?.() // webpack 场景下的 hmr
  }
}
if (!window.__disableClientRender__) {
  // 如果服务端直出的时候带上该记号，则默认不进行客户端渲染，将处理逻辑交给上层
  // 可用于微前端场景下自定义什么时候进行组件渲染的逻辑调用
  clientRender()
}

export {
  clientRender
}
