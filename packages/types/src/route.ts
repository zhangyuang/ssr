import { IFaaSContext } from './ctx'

export interface ProvisionalFeRouteItem {
  path?: string
  layout: string
  fetch?: string
  component?: string
}

export interface FeRouteItem<T= {}> {
  path: string
  layout: React.FC<{ctx?: IFaaSContext, fetchData?: any }>
  fetch?: (ctx: IFaaSContext) => Promise<any>
  component?: React.FC<T>
}

export interface FaasRouteItem {
  path: string
  mode: string
  funcName: string
}
