import * as yargs from 'yargs'
import { FeRouteItem } from './index'

export type Argv = yargs.Arguments<{ yml?: Yml, ymlRoutes?: YmlRouteItem[], routes: FeRouteItem[], mpa?: boolean} >

export interface Yml {
  service: string
  provider: {
    name: string
    runtime: string
  },
  functions: {
    [index: string]: {
      handler: string
      render: Render<{}>
      events: Events[]
    }
  }
}

interface YmlRouteItem {
  path: string
  mode: boolean
  funcName: string
}

export type Render<T> = T & {
  funcName: string
  component: string
  layout?: string
  fetch?: string
  mode: string
  injectScript?: string[]
  injectCss?: string[]
}
interface Events {
  http?: {
    path: string
    method: string[]
  }
}
