import type { ParamsNest } from 'ssr-plugin-vue'
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