import { Store } from 'vuex'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { ISSRMidwayKoaContext } from 'ssr-types'
import { IndexData } from '~/typings/data'
interface ApiDeatilservice {
  index: (id: string) => Promise<IndexData>
}
interface Params {
  store: Store<any>
  router: RouteLocationNormalizedLoaded
  ctx?: ISSRMidwayKoaContext<{
    apiDeatilservice?: ApiDeatilservice
  }>
}
export default async ({ store, router, ctx }: Params) => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${router.params.id}`)).json() : await ctx?.apiDeatilservice?.index(ctx.params.id)
  await store.dispatch('detailStore/initialData', { payload: data })
}
