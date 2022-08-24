import type { ParamsNest } from 'ssr-plugin-vue3'
import { IndexData } from './page-index'
import { Ddata } from './detail-index'

interface IApiService {
  index: () => Promise<IndexData>
}
interface ApiDeatilservice {
  index: (id: string) => Promise<Ddata>
}

export type Params = ParamsNest<any, {
  apiService: IApiService
  apiDeatilservice: ApiDeatilservice
}>