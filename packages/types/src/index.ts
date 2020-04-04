import { FaaSContext } from '@midwayjs/faas'
import { Yml } from './yml'
export * from './yml'

export type Mode = 'development' | 'production'

export interface IWindow extends Window {
  __USE_SSR__?: string
  __INITIAL_DATA__?: any
}

export interface INodeModule extends NodeModule {
  hot?: Hot
}
export interface Hot {
  accept (path?: string): void
}

export interface IFaaSContext extends FaaSContext {
  serverData?: any
  yml: Yml
}
export interface Global extends NodeJS.Global {
  renderToNodeStream: (element: React.ReactElement) => NodeJS.ReadableStream
  serverStream: (ctx: IFaaSContext) => Promise<React.ReactElement>
  isLocal: boolean
}

export interface Global extends NodeJS.Global {
  renderToNodeStream: (element: React.ReactElement) => NodeJS.ReadableStream
  serverStream: (ctx: IFaaSContext) => Promise<React.ReactElement>
  isLocal: boolean
}
export interface FC extends React.FC {
  getInitialProps?: (params: any) => Promise<any>
  Layout?: React.FC
  preload?: () => Promise<Preload>
}

interface Preload {
  default: React.FC
}

export interface ServerJs {
  (ctx: FaaSContext): React.ReactElement
}

export interface FeRouteItem {
  path: string
  layout: string
  fetch?: string
  component: string
}
