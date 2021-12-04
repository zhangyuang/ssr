import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRMidwayContext } from 'ssr-types'
import { IndexData } from '~/typings/data'
interface ApiDeatilservice {
  index: (id: string) => Promise<IndexData>
}
interface Params {
  store: Store<any>
  router: RouteLocationNormalizedLoaded
}
export default async ({ store, router }: Params, ctx?: ISSRMidwayContext<{
  apiDeatilservice?: ApiDeatilservice
}>) => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${router.params.id}`)).json() : await ctx?.apiDeatilservice?.index(ctx.params.id)
  await store.dispatch('detailStore/initialData', { payload: data })
}
