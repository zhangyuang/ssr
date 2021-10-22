export default (_, ctx) => {
  const ua = __isBrowser__ ? navigator.userAgent : ctx.request.header['user-agent']
  return {
    ua
  }
}
