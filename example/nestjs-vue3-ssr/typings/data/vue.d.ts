import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRNestContext } from 'ssr-types'
import { Pinia } from 'pinia'

import { IndexData, Ddata } from '~/typings/data'
interface IApiService {
  index: () => Promise<IndexData>
}
interface ApiDeatilservice {
  index: (id: string) => Promise<Ddata>
}

export interface Params {
  store: Store<any>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRNestContext<{
    apiService?: IApiService,
    apiDeatilservice?: ApiDeatilservice
  }>
  pinia: Pinia
}
