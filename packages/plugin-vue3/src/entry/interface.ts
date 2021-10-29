import { VNode } from 'vue'
import { Store, StoreOptions } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ESMFeRouteItem, ISSRContext } from 'ssr-types'

export type Fetch = (params: {store: Store<any>, router: RouteLocationNormalizedLoaded}, ctx?: ISSRContext) => Promise<any>
export type ESMFetch = () => Promise<{
  default: Fetch
}>

export type IClientFeRouteItem = ESMFeRouteItem<{
  fetch?: ESMFetch
}>

export type IServerFeRouteItem = ESMFeRouteItem<{
  fetch?: Fetch|ESMFetch
}>

export interface RoutesType {
  Layout: VNode
  App: VNode
  layoutFetch?: (params: {store: Store<any>, router: RouteLocationNormalizedLoaded}, ctx?: ISSRContext) => Promise<any>
  FeRoutes: IClientFeRouteItem[]
  PrefixRouterBase?: string
  store?: StoreOptions<any>
}

export interface VueRouterOptions {
  base?: string
}
