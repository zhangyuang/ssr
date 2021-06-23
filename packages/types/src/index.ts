export * from './ctx'
export * from './config'
export * from './yargs'

export type Mode = 'development' |'production'

export type ESMFeRouteItem<T={}> = {
  path: string
  webpackChunkName: string
} & T
