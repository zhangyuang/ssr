
export default async (ctx: any) => {
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${ctx.match.params.id}`)).json() : await ctx.apiDeatilservice.index(ctx.params.id)
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    detailData: data
  }
}
