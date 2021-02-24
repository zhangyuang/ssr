import { ISSRContext } from 'ssr-types'
import { IndexData } from '@/interface'

interface ApiDeatilservice {
  index: (params: any) => Promise<IndexData>
}

export default async ({ store, router }, ctx?: ISSRContext<{
  apiDeatilservice?: ApiDeatilservice
}>) => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${router.params.id}`)).json() : await ctx?.apiDeatilservice?.index(ctx.request.params.id)
  await store.dispatch('detailStore/initialData', { payload: data })
}
