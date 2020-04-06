import { IFaaSContext } from './ctx'

export interface ProvisionalFeRouteItem {
  path: string
  layout: string
  fetch?: string
  component?: string
}

export interface FeRouteItem {
  path: string
  layout: React.FC<{ctx?: IFaaSContext, fetchData?: any }>
  fetch?: (ctx: IFaaSContext) => Promise<any>
  component?: React.FC
}

export interface FaasRouteItem {
  path: string
  mode: string
  funcName: string
}
