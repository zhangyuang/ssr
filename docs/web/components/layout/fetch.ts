export default (_, ctx) => {
  const ua = __isBrowser__ ? navigator.userAgent : ctx.request.header['user-agent']
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)

  return {
    isMobile
  }
}
