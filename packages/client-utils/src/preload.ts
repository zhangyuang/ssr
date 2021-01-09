import { FeRouteItem } from 'ssr-types'

const pathToRegexp = require('path-to-regexp')

const preloadComponent = async (Routes: FeRouteItem[]) => {
  const pathName = location.pathname
  for (const route of Routes) {
    const { component, path } = route
    let activeComponent = component
    if (activeComponent.preload && pathToRegexp(path).test(pathName)) {
      activeComponent = (await activeComponent.preload()).default
    }
    route.component = activeComponent
  }
  return Routes
}

export { preloadComponent }
