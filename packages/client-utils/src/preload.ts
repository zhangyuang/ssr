// @ts-nocheck
import { ReactClientESMFeRouteItem, IWindow } from 'ssr-types'
import { pathToRegexp } from 'path-to-regexp'
import { normalizePath } from './utils'

declare const window: IWindow

const preloadComponent = async (Routes: ReactClientESMFeRouteItem[], BASE_NAME?: string) => {
  // 预加载当前页面对应的组件
  for (const route of Routes) {
    const { component, path } = route
    let activeComponent = component
    if (window.__USE_VITE__) {
      route.component = (await activeComponent()).default
    } else {
      let pathname = location.pathname
      if (BASE_NAME) {
        pathname = normalizePath(pathname, BASE_NAME)
      }
      if (activeComponent.preload && pathToRegexp(path).test(pathname)) {
        // 针对 react-loadble 包裹的组件
        activeComponent = (await activeComponent.preload()).default
      }
      route.component = activeComponent
    }
  }
  return Routes
}

export { preloadComponent }
