import { FeRouteItem } from 'ssr-types'

const pathToRegexp = require('path-to-regexp')

const preloadComponent = async (Routes: FeRouteItem[]) => {
  // 预加载当前页面对应的组件
  const pathName = location.pathname
  for (const route of Routes) {
    const { component, path } = route
    let activeComponent = component
    if (activeComponent.preload && pathToRegexp(path).test(pathName)) {
      // 针对 react-loadble 包裹的组件
      activeComponent = (await activeComponent.preload()).default
    } else if (/promise/i.test(String(activeComponent))) {
      // 针对 vue 场景 () => import 返回 promis的组件
      activeComponent = (await activeComponent()).default
    }
    route.component = activeComponent
  }
  return Routes
}

export { preloadComponent }
