import { LayoutProps, FC, Fetch } from './fc'

export interface ProvisionalFeRouteItem {
  path?: string
  layout: string
  fetch?: string
  component?: string
}

export type FeRouteItem<T = {}, U={}> = {
  path: string
  layout: React.FC<LayoutProps>
  fetch?: Fetch
  component: FC<T>
  webpackChunkName?: string
} & U

export type ESMFeRouteItem<T = {}, U={}> = {
  path: string
  layout: () => Promise<React.FC<LayoutProps>>
  fetch?: () => Promise<{
    default: Fetch
  }>
  component: FC<T>
  webpackChunkName?: string
} & U

export interface ParseFeRouteItem {
  path?: string
  layout?: string
  App?: string
  fetch?: string
  component?: string
  webpackChunkName?: string
}
export interface FaasRouteItem {
  path: string
  mode: string
  funcName: string
}
