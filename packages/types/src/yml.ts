import * as yargs from 'yargs'

export type Argv = yargs.Arguments<{ yml?: Yml, routes?: Routes[]}>

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

export type Routes = RouteItem[]
export type RouteItem = Render<{path: string}>

export type Render<T> = T & {
  component: string
  layout?: string
  fetch?: string
  mode: string
  injectScript: string[]
  injectCss: string[]
  serverBundle: string
}
interface Events {
  http?: {
    path: string
    method: string[]
  }
}
