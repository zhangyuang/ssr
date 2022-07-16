import { VNode } from 'vue'
import { Store, StoreOptions } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRMidwayKoaContext, ISSRNestContext, ISSRContext, ESMFeRouteItem } from 'ssr-types'
import { Pinia } from 'pinia'

export interface ParamsKoa<T=any, U=any> {
  store: Store<T>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRMidwayKoaContext<U>
  pinia: Pinia
}

export interface ParamsNest<T=any, U=any> {
  store: Store<T>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRNestContext<U>
  pinia: Pinia
}

export type Params = ParamsKoa | ParamsNest

export type Fetch = (params: Params, ctx?: ISSRContext) => Promise<any>
export type ESMFetch = () => Promise<{
  default: Fetch
}>

export type IFeRouteItem = ESMFeRouteItem<{
  fetch?: ESMFetch
}>

export interface RoutesType {
  Layout: VNode
  App: VNode
  layoutFetch?: (params: Params, ctx?: ISSRContext) => Promise<any>
  FeRoutes: IFeRouteItem[]
  store?: StoreOptions<any>
}

export interface VueRouterOptions {
  base?: string
}
