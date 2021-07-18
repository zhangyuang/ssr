import * as Koa from 'koa'
import { Request, Response } from 'express'
import { FaaSHTTPContext } from '@midwayjs/faas-typings'
import { Context } from 'egg'

interface ExpressContext {
  request: Request & {
    params: Request['params']
  }
  response: Response
}

export type ISSRContext<T={}> = (Koa.Context|ExpressContext|FaaSHTTPContext|Context) & T

export interface Options {
  mode?: string
}
export interface IWindow extends Window {
  __USE_SSR__?: boolean
  __INITIAL_DATA__?: any
  STORE_CONTEXT?: any
  __USE_VITE__?: boolean
}

export interface IGlobal {
  window: {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
  }
}
