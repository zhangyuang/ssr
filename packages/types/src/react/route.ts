import type { RouteComponentProps } from 'react-router-dom'
import type { Action } from './component'
import type { ISSRContext, ISSRNestContext, ISSRMidwayContext, ISSRMidwayKoaContext } from '../ctx'
import type { IConfig } from '../config'

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

export interface Params<T, U> {
  ctx?: ISSRContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}
export interface ParamsMidway<T, U> {
  ctx?: ISSRMidwayContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}
export interface ParamsMidwayKoa<T, U> {
  ctx?: ISSRMidwayKoaContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}
export interface ParamsNest<T, U> {
  ctx?: ISSRNestContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}

export type ReactFetch<T={}, U={}> = (params: Params<T, U>) => Promise<any>
export type ReactMidwayFetch<T={}, U={}> = (params: ParamsMidway<T, U>) => Promise<any>
export type ReactMidwayKoaFetch<T={}, U={}> = (params: ParamsMidwayKoa<T, U>) => Promise<any>
export type ReactNestFetch<T={}, U={}> = (params: ParamsNest<T, U>) => Promise<any>

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

export type ReactESMFeRouteItem<T = {}, U={}> = {
  path: string
  childPath?: string
  fetch?: ReactESMFetch
  component: DynamicFC<T>
  webpackChunkName: string
  children?: Array<ReactESMFeRouteItem<T, U>>
} & U

export type ReactESMPreloadFeRouteItem<T = {}, U={}> = {
  path: string
  childPath?: string
  fetch?: ReactESMFetch
  component: DynamicFC<T> | StaticFC<T>
  webpackChunkName: string
} & U

export interface ReactRoutesType {
  Layout: React.FC<LayoutProps>
  App?: (props: LayoutProps) => JSX.Element
  layoutFetch: ReactFetch
  FeRoutes: ReactESMFeRouteItem[]
  state?: any
  reducer?: any
  valtioState?: any
}

export interface IContext<T=any> {
  state?: T
  dispatch?: React.Dispatch<Action>
}

export interface PipeableStream {
  abort: () => void
  pipe: <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable
}
