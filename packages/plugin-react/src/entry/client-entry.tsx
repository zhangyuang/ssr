//@ts-nocheck
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent } from 'ssr-client-utils'
import { wrapComponent } from 'ssr-hoc-react'
import { IWindow, LayoutProps, ReactClientESMFeRouteItem, ReactClientRoutesType } from 'ssr-types-react'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App, BASE_NAME } = Routes as ReactClientRoutesType

declare const module: any
declare const window: IWindow

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function (props: LayoutProps) {
    return props.children!
  }
  // 客户端渲染||hydrate
  const routes = await preloadComponent(FeRoutes, BASE_NAME)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter basename={BASE_NAME}>
      <AppContext>
        <Switch>
        <IApp>
          <Switch>
            {
            // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
              routes.map((item: ReactClientESMFeRouteItem) => {
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
