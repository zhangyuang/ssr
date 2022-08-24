import { Params } from '~/typings/data'
import { useIndexStore } from '@/pinia-store'

export default async ({ store, router, pinia, ctx }: Params) => {
  // 阅读文档获得更多信息 http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
  const indexStore = useIndexStore(pinia)
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx?.apiService?.index()
  indexStore.setData(data)
}
