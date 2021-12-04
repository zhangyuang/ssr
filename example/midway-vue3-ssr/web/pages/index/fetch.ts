import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRMidwayContext } from 'ssr-types'
import { IndexData } from '~/typings/data'
interface IApiService {
  index: () => Promise<IndexData>
}
interface Params {
  store: Store<any>
  router: RouteLocationNormalizedLoaded
}

export default async ({ store, router }: Params, ctx?: ISSRMidwayContext<{
  apiService?: IApiService
}>) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx?.apiService?.index()
  await store.dispatch('indexStore/initialData', { payload: data })
}
