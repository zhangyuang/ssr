import { ReactNestFetch } from 'ssr-types-react'
import { Ddata } from '~/typings/data'

const fetch: ReactNestFetch<{
  apiDeatilservice: {
    index: (id: string) => Promise<Ddata>
  }
}, {id: string}> = async ({ ctx, routerProps }) => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${routerProps!.match.params.id}`)).json() : await ctx!.apiDeatilservice.index(ctx!.request.params.id)
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    detailData: data
  }
}
export default fetch
