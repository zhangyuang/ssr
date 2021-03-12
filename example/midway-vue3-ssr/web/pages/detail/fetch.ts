import { ISSRContext } from 'ssr-types'
import { IndexData } from '@/interface'
interface ApiDeatilservice {
  index: () => Promise<IndexData>
}

export default async ({ store, router }, ctx?: ISSRContext<{
  apiDeatilservice?: ApiDeatilservice
}>) => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${router.value ? router.value.params.id : router.params.id}`)).json() : await ctx?.apiDeatilservice?.index(ctx.params.id)
  await store.dispatch('detailStore/initialData', { payload: data })
}
