import { LayoutProps, FC, Fetch } from './fc'

export interface ProvisionalFeRouteItem {
  path?: string
  layout: string
  fetch?: string
  component?: string
}

export interface FeRouteItem<T = {}> {
  path: string
  layout: React.FC<LayoutProps>
  fetch?: Fetch
  component: FC<T>
  webpackChunkName?: string
}

export interface FaasRouteItem {
  path: string
  mode: string
  funcName: string
}
