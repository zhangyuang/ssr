import { Component } from 'vue'
import { Store } from 'vuex'
import { Route } from 'vue-router'
import { ESMFeRouteItem, ISSRContext } from 'ssr-types'

export type Fetch = (params: {store: Store<any>, router: Route}, ctx?: ISSRContext) => Promise<any>
export type ESMFetch = () => Promise<{
  default: Fetch
}>

export type IClientFeRouteItem = ESMFeRouteItem<{
  fetch?: ESMFetch
}>

export type IServerFeRouteItem = ESMFeRouteItem<{
  fetch?: Fetch
}>

export interface RoutesType {
  Layout: Component
  App: Component
  layoutFetch?: (params: {store: Store<any>, router: Route}, ctx?: ISSRContext) => Promise<any>
  FeRoutes: IClientFeRouteItem[]
  BASE_NAME?: string
}
