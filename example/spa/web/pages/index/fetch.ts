export default async ctx => {
  const data = __isBrowser__ ? (await window.fetch('/api/index')).json() : await ctx.apiService.index()
  return data
}
