export default async ctx => {
  const data = __isBrowser__ ? (await window.fetch('/api/getIndexData')).json() : await ctx.apiService.index()
  return data
}
