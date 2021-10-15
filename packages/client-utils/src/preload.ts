// @ts-nocheck
import { ReactClientESMFeRouteItem } from 'ssr-types'
import { pathToRegexp } from 'path-to-regexp'
import { normalizePath } from './utils'

const preloadComponent = async (Routes: ReactClientESMFeRouteItem[], BASE_NAME?: string) => {
  for (const route of Routes) {
    const { component, path } = route
    let pathname = location.pathname
    if (BASE_NAME) {
      pathname = normalizePath(pathname, BASE_NAME)
    }
    if (component.name === 'dynamicComponent' && pathToRegexp(path).test(pathname)) {
      route.component = (await component()).default
    }
  }
  return Routes
}

export { preloadComponent }
