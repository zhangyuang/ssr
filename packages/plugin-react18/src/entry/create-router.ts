import { combineRoutes } from 'ssr-common-utils'
import * as declareRoutes from '_build/ssr-declare-routes'
import * as ManualRoutes from '_build/ssr-manual-routes'
import { ReactRoutesType } from 'ssr-types'

const Routes = combineRoutes(declareRoutes, ManualRoutes) as ReactRoutesType

export {
  Routes
}
