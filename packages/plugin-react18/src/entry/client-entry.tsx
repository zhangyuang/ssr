import { createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'react-router' // for vite prebundle list
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent, isMicro, setStoreContext } from 'ssr-common-utils'
import { wrapComponent } from 'ssr-hoc-react18'
import { LayoutProps } from 'ssr-types'
import { STORE_CONTEXT as Context } from '_build/create-context'
import { Routes } from './create-router'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App } = Routes

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function (props: LayoutProps) {
    return props.children!
  }
  setStoreContext(Context)
  // 客户端渲染||hydrate
  const baseName = isMicro() ? window.clientPrefix : window.prefix
  const routes = await preloadComponent(FeRoutes, baseName)
  const container = document.querySelector(window.ssrDevInfo.rootId)!
  const ele = createElement(BrowserRouter as any, {
    basename: baseName
  }, createElement(AppContext as any, {
    children: createElement(Switch as any, null,
      createElement(IApp as any, null, createElement(Switch as any, null,
        routes.map(item => {
          const { fetch, component, path } = item
          component.fetch = fetch
          component.layoutFetch = layoutFetch
          const WrappedComponent = wrapComponent(component)
          return createElement(Route as any, {
            exact: true,
            key: path,
            path: path,
            render: () => createElement(WrappedComponent as any, {
              key: location.pathname
            })
          })
        }))))
  }))
  if (window.__USE_SSR__) {
    hydrateRoot(container, ele)
  } else {
    const root = createRoot(container)
    root.render(ele)
  }
  if (!window.__USE_VITE__) {
    (module as any)?.hot?.accept?.()
  }
}

clientRender()

export {
  clientRender
}
