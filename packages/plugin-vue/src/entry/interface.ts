import { Component } from 'vue'
import { Store, StoreOptions } from 'vuex'
import { Route } from 'vue-router'
import { ESMFeRouteItem, ISSRContext } from 'ssr-types'

export type Fetch = (params: {store: Store<any>, router: Route}, ctx?: ISSRContext) => Promise<any>
export type ESMFetch = () => Promise<{
  default: Fetch
}>

export type IFeRouteItem = ESMFeRouteItem<{
  fetch?: ESMFetch
}>

export interface RoutesType {
  Layout: Component
  App: Component
  layoutFetch?: (params: {store: Store<any>, router: Route}, ctx?: ISSRContext) => Promise<any>
  FeRoutes: IFeRouteItem[]
  store: StoreOptions<any>
}

export interface VueRouterOptions {
  base?: string
}
