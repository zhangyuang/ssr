// @ts-expect-error
import * as declareRoutes from '_build/ssr-temporary-routes'
// @ts-expect-error
import * as ManualRoutes from '_build/ssr-manual-routes'
import { ReactRoutesType } from 'ssr-types-react'

const declareRoutesWithType = declareRoutes as ReactRoutesType
const ManualRoutesWithType = ManualRoutes as ReactRoutesType

const Routes: ReactRoutesType = {
  ...declareRoutes,
  ...ManualRoutesWithType
}
if (ManualRoutesWithType.FeRoutes) {
  // 如果存在相同 path，取声明式路由为最高优先级
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
