import { RouteComponentProps } from 'react-router'

export default async ctx => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${(ctx as RouteComponentProps<{id: string}>).match.params.id}`)).json() : await ctx.apiDeatilservice.index(/detail\/(.*)(\?|\/)?/.exec(ctx.req.path)[1])
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    detailData: data
  }
}
