import { createElement } from 'react'
import * as ReactDOM from 'react-dom'
import 'react-router' // for vite prebundle list
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent, isMicro, setStoreContext, setStore } from 'ssr-common-utils'
import { wrapComponent } from 'ssr-hoc-react'
import { LayoutProps } from 'ssr-types'
import { ssrCreateContext, Routes, createStore } from './create'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App } = Routes

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function(props: LayoutProps) {
    return props.children!
  }
  setStoreContext(ssrCreateContext() as any)
  const store = createStore(window.__VALTIO_DATA__)
  setStore(store ?? {})
  const baseName = isMicro() ? window.clientPrefix : window.prefix
  const routes = await preloadComponent(FeRoutes, baseName)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    createElement(BrowserRouter, {
      basename: baseName
    }, createElement(AppContext, {
      children: createElement(Switch, null,
        createElement(IApp as any, null, createElement(Switch, null,
          routes.map(item => {
            const { fetch, component, path } = item
            component.fetch = fetch
            component.layoutFetch = layoutFetch
            const WrappedComponent = wrapComponent(component)
            return createElement(Route, {
              exact: true,
              key: path,
              path: path,
              render: () => createElement(WrappedComponent, {
                key: location.pathname
              })
            })
          }))))
    }))
    , document.querySelector(window.ssrDevInfo.rootId ?? '#app'))
  if (!window.__USE_VITE__) {
    (module as any)?.hot?.accept?.()
  }
}

clientRender()

export {
  clientRender
}
