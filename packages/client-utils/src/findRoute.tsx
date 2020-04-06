import { pathToRegexp } from 'path-to-regexp'

function findRoute<T extends {path: string}> (Routes: T[], path: string): T {
  // 根据请求的path来匹配到对应的Component
  const route = Routes.find(route => pathToRegexp(route.path).test(path))
  return route
}

export {
  findRoute
}
