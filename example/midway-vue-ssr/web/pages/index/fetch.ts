import { ISSRContext } from 'ssr-types'
import { IndexData } from '@/interface'
interface IApiService {
  index: () => Promise<IndexData>
}

export default async (store, ctx?: ISSRContext<{
  apiService?: IApiService
}>) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx?.apiService?.index()
  store.dispatch('indexStore/initialData', { payload: data })
}
