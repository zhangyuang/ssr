
import { Params } from '~/typings/data'

export default async ({ store, router, ctx }: Params) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx?.apiService?.index()
  await store.dispatch('indexStore/initialData', { payload: data })
}
