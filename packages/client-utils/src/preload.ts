// @ts-nocheck
import { ReactClientESMFeRouteItem, IWindow } from 'ssr-types'
import { pathToRegexp } from 'path-to-regexp'

declare const window: IWindow

const preloadComponent = async (Routes: ReactClientESMFeRouteItem[]) => {
  // 预加载当前页面对应的组件
  const pathName = location.pathname
  for (const route of Routes) {
    const { component, path } = route
    let activeComponent = component
    if (window.__USE_VITE__) {
      route.component = (await activeComponent()).default
    } else {
      if (activeComponent.preload && pathToRegexp(path).test(pathName)) {
        // 针对 react-loadble 包裹的组件
        activeComponent = (await activeComponent.preload()).default
      }
      route.component = activeComponent
    }
  }
  return Routes
}

export { preloadComponent }
