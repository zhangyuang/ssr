import { ISSRContext } from './ctx'
import { IConfig } from './config'

export type Fetch = (params: any, ctx?: ISSRContext) => Promise<any>

export interface FC<T={}> extends React.FC<T> {
  fetch?: Fetch
  layoutFetch?: Fetch
  preload?: () => Promise<FC>
}

export interface LayoutProps {
  ctx?: ISSRContext
  fetchData?: any
  config?: IConfig
  children?: JSX.Element
  staticList?: StaticList
}
export interface StaticList {
  injectCss: JSX.Element[]
  injectScript: JSX.Element[]
}
