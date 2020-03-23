import { Context } from 'midway'
import { RouteItem } from './route'
export interface Config {
  baseDir?: string
  type?: string
  serverJs: ServerJs | string
  env?: string
  useCDN?: string
  routes: RouteItem[]
  injectScript: string[]
  injectCss: string[]
}

export interface ServerJs {
  (ctx: Context): React.ReactElement
}
