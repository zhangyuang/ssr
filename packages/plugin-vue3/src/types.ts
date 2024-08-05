import type { VNode, RendererNode, RendererElement } from 'vue'
import type { Store, StoreOptions } from 'vuex'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { ISSRMidwayKoaContext, ISSRNestContext, ISSRContext, ESMFeRouteItem } from 'ssr-types'
import type { Pinia } from 'pinia'

export interface ParamsKoa<T={}, U={}> {
  store: Store<T>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRMidwayKoaContext<U>
  pinia: Pinia
}

export interface ParamsNest<T={}, U={}> {
  store: Store<T>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRNestContext<U>
  pinia: Pinia
}

export interface Params<T={}, U={}> {
  store: Store<T>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRContext<U>
  pinia: Pinia
}
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

export interface vue3AppParams {
  rootId: string
  combineAysncData: any
  state: any
  layoutFetchData: any
  asyncData: any
  manifest: Record<string, string | undefined>
  isCsr: boolean
  jsInject: Array<VNode<RendererNode, RendererElement, {
    [key: string]: any
  }>>
  cssInject: Array<VNode<RendererNode, RendererElement, {
    [key: string]: any
  }>>
  inlineCssOrder: string[]
  inlineJsOrder: string[]
}
