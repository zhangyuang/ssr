import { Store } from 'vuex'
import { Route } from 'vue-router'
import { ISSRNestContext } from 'ssr-types'
import { IndexData, Ddata } from '~/typings/data'
interface IApiService {
  index: () => Promise<IndexData>
}
interface ApiDeatilservice {
  index: (id: string) => Promise<Ddata>
}
interface Params {
  store: Store<any>
  router: Route
  ctx?: ISSRNestContext<{
    apiService?: IApiService
    apiDeatilservice?: ApiDeatilservice
  }>
}