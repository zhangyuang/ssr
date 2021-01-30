import { FaaSContext } from '@midwayjs/faas'
import { Action } from './component'

interface EggContext {
  req: {
    _parsedUrl?: {
      pathname: string
    }
  }
}
export type IFaaSContext<T={}> = FaaSContext & EggContext &T

export interface Options {
  mode?: string
}
export interface IWindow extends Window {
  __USE_SSR__?: boolean
  __INITIAL_DATA__?: any
  STORE_CONTEXT?: any
}

export interface IGlobal extends NodeJS.Global {
  window: {
    __USE_SSR__?: IWindow['__USE_SSR__']
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__']
    STORE_CONTEXT?: IWindow['STORE_CONTEXT']
  }
}

export interface IContext<T=any> {
  state?: T
  dispatch?: React.Dispatch<Action>
}
