export default async ctx => {
  return {
    'title': `当前路由为${ctx.req.path}`
  }
}
