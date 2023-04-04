import type { ReactRoutesType } from 'ssr-types'

export const normalizePath = (path: string, prefix: string) => {
  // 移除 prefix 保证 path 跟路由表能够正确匹配
  const res = normalizeStartPath(path.replace(prefix, ''))
  return res
}

export const normalizeStartPath = (path: string) => {
  if (path.startsWith('//')) {
    path = path.replace('//', '/')
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return path
}
export const normalizeEndPath = (path: string) => {
  if (!path.endsWith('/')) {
    path = `${path}/`
  }
  return path
}

export const isMicro = () => {
  return !!((window as any).microApp)
}

export const combineRoutes = (declareRoutes: any, manualRoutes: any): any => {
  const declareRoutesType = declareRoutes as ReactRoutesType
  const manualRoutesType = manualRoutes as ReactRoutesType
  const Routes = {
    ...declareRoutesType,
    ...manualRoutesType
  }
  if (manualRoutesType.FeRoutes) {
    // 声明式路由覆盖约定式路由同名path
    const combineRoutes = declareRoutesType.FeRoutes.map(route => manualRoutesType.FeRoutes.find(e => e.path === route.path) ?? route)
    manualRoutesType.FeRoutes.forEach(route => {
      // 补充声明式路由新增的配置
      const found = combineRoutes.find(e => e.path === route.path)
      if (!found) {
        combineRoutes.push(route)
      }
    })
    updateChildPath(combineRoutes, null)
    Routes.FeRoutes = combineRoutes
  }
  return Routes
}

const updateChildPath = (routes: ReactRoutesType['FeRoutes'], parentpath: string|null) => {
  routes.forEach(route => {
    const { path } = route
    if (parentpath) {
      route.childPath = path.startsWith('/') ? `${parentpath}${path}` : `${parentpath}/${path}`
    }
    if (route.children) {
      updateChildPath(route.children, path)
    }
  })
}
