import { ISSRContext } from './ctx'
import { IConfig } from './config'

export type Fetch = (params: any) => Promise<any>

export interface FC<T={}> extends React.FC<T> {
  fetch?: Fetch
}

export interface LayoutProps {
  ctx?: ISSRContext
  fetchData?: any
  config?: IConfig
  children?: React.ReactElement
  staticList?: StaticList
}
export interface StaticList {
  injectCss: JSX.Element[]
  injectScript: JSX.Element[]
}
