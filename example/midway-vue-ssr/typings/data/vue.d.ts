import type { ParamsKoa } from 'ssr-plugin-vue'
interface IApiService {
  index: () => Promise<IndexData>
}
interface ApiDeatilservice {
  index: (id: string) => Promise<Ddata>
}

export type Params = ParamsKoa<any, {
  apiService: IApiService
  apiDeatilservice: ApiDeatilservice
}>