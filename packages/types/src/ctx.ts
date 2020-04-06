import { FaaSContext } from '@midwayjs/faas'
import { FaasRouteItem } from './route'

export interface IFaaSContext extends FaaSContext {
  fetchData?: any
}

export interface IGlobal extends NodeJS.Global {
  renderToNodeStream: (element: React.ReactElement) => NodeJS.ReadableStream
  renderToString: (element: React.ReactElement) => string
  serverRender: (ctx: IFaaSContext, options: Options) => Promise<React.ReactElement>
}

export interface Options {
  faasRoutes: FaasRouteItem[]
}
export interface IWindow extends Window {
  __USE_SSR__?: string
  __INITIAL_DATA__?: any
}
