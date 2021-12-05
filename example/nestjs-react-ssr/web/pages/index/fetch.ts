import { ReactNestFetch } from 'ssr-types-react'
import { IndexData } from '~/typings/data'

const fetch: ReactNestFetch<{
  apiService: {
    index: () => Promise<IndexData>
  }
}> = async ({ ctx, routerProps }) => {
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx!.apiService?.index()
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: data
  }
}

export default fetch
