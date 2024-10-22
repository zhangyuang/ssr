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

export interface Params<T, U extends { [K in keyof U]?: string | undefined }> {
  ctx?: ISSRContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}
export interface ParamsMidway<T, U extends { [K in keyof U]?: string | undefined }> {
  ctx?: ISSRMidwayContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}
export interface ParamsMidwayKoa<T, U extends { [K in keyof U]?: string | undefined }> {
  ctx?: ISSRMidwayKoaContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}
export interface ParamsNest<T, U extends { [K in keyof U]?: string | undefined }> {
  ctx?: ISSRNestContext<T>
  routerProps?: RouteComponentProps<U>
  state?: any
}

export type ReactFetch<T={}, U extends { [K in keyof U]?: string | undefined } = {}> = (params: Params<T, U>) => Promise<any>
export type ReactMidwayFetch<T={}, U extends { [K in keyof U]?: string | undefined } = {}> = (params: ParamsMidway<T, U>) => Promise<any>
export type ReactMidwayKoaFetch<T={}, U extends { [K in keyof U]?: string | undefined } = {}> = (params: ParamsMidwayKoa<T, U>) => Promise<any>
export type ReactNestFetch<T={}, U extends { [K in keyof U]?: string | undefined } = {}> = (params: ParamsNest<T, U>) => Promise<any>

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
  store?: any
}

export interface IContext<T=any> {
  state?: T
  dispatch?: React.Dispatch<Action>
}

export interface PipeableStream {
  abort: () => void
  pipe: <Writable extends NodeJS.WritableStream>(destination: Writable) => Writable
}
