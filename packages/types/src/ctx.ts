import { Request, Response } from 'express'
import { Context } from 'egg'

export interface ExpressContext {
  request: Request
  response: Response
}

export type ISSRContext<T={}> = (ExpressContext|Context) & T
export type ISSRNestContext<T={}> = ExpressContext & T
export type ISSRMidwayContext<T={}> = Context & T

export interface Options {
  mode?: string
}
export interface IWindow extends Window {
  __USE_SSR__?: boolean
  __INITIAL_DATA__?: any
  STORE_CONTEXT?: any
  __USE_VITE__?: boolean
  __disableClientRender__?: boolean
  prefix?: string
}

export interface IGlobal {
  window: {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
  }
}
