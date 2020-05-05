export default async ctx => {
  const data = await ctx.apiService.index()
  return data
}
