import { RouteComponentProps } from 'react-router-dom'
import { ISSRContext, IConfig } from 'ssr-types'
import { Action } from './component'

export interface LayoutProps {
  ctx?: ISSRContext
  config?: IConfig
  children?: JSX.Element
  staticList?: StaticList
  injectState?: any
}
export interface StaticList {
  injectCss: JSX.Element[]
  injectScript: JSX.Element[]
}

export interface ProvisionalFeRouteItem {
  path?: string
  layout: string
  fetch?: string
  component?: string
}

export type ReactFetch = (params: ISSRContext | RouteComponentProps, state?: any) => Promise<any>

export type ReactESMFetch = () => Promise<{
  default: ReactFetch
}>

export type ESMLayout = () => Promise<React.FC<LayoutProps>>

export interface StaticFC<T={}> extends React.FC<T> {
  fetch?: ReactESMFetch
  layoutFetch?: ReactFetch
}

export interface DynamicFC<T = {}> extends React.FC<T>{
  (): Promise<{
    default: StaticFC<T>
  }>
  name: 'dynamicComponent'
  fetch?: ReactESMFetch
  layoutFetch?: ReactFetch
}

export type ReactServerESMFeRouteItem<T = {}, U={}> = {
  path: string
  fetch?: ReactFetch
  component: StaticFC<T>
  webpackChunkName: string
} & U

export type ReactClientESMFeRouteItem<T = {}, U={}> = {
  path: string
  fetch?: ReactESMFetch
  component: DynamicFC<T>
  webpackChunkName: string
} & U

export interface ReactRoutesType {
  Layout: React.FC<LayoutProps>
  App?: React.FC
  layoutFetch: ReactFetch
  FeRoutes: ReactServerESMFeRouteItem[]
  PrefixRouterBase?: string
  state?: any
  reducer?: any
}
export interface ReactClientRoutesType {
  Layout: React.FC<LayoutProps>
  App?: React.FC
  layoutFetch: ReactFetch
  FeRoutes: ReactClientESMFeRouteItem[]
  PrefixRouterBase?: string
  state?: any
  reducer?: any
}

export interface IContext<T=any> {
  state?: T
  dispatch?: React.Dispatch<Action>
}
