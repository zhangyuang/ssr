// @ts-expect-error
import * as declareRoutes from '_build/ssr-temporary-routes'
// @ts-expect-error
import * as ManualRoutes from '_build/ssr-manual-routes'
import { RoutesType } from './interface'

const declareRoutesWithType = declareRoutes as RoutesType
const ManualRoutesWithType = ManualRoutes as RoutesType

const Routes: RoutesType = {
  ...declareRoutes,
  ...ManualRoutesWithType
}
if (ManualRoutesWithType.FeRoutes) {
  const combineRoutes = declareRoutesWithType.FeRoutes.map(route => {
    const found = ManualRoutesWithType.FeRoutes.find(e => e.path === route.path)
    return found ?? route
  })
  declareRoutesWithType.FeRoutes.forEach(route => {
    // 补充声明式路由新增的配置
    const found = combineRoutes.find(e => e.path === route.path)
    if (!found) {
      combineRoutes.push(route)
    }
  })
  Routes.FeRoutes = combineRoutes
}
export {
  Routes
}
