import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRMidwayKoaContext } from 'ssr-types'
import { Pinia } from 'pinia'
import { IndexData } from './page-index'
import { Ddata } from './detail-index'

interface IApiService {
  index: () => Promise<IndexData>
}
interface ApiDeatilservice {
  index: (id: string) => Promise<Ddata>
}

export interface Params {
  store: Store<any>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRMidwayKoaContext<{
    apiService?: IApiService,
    apiDeatilservice?: ApiDeatilservice
  }>
  pinia: Pinia
}
