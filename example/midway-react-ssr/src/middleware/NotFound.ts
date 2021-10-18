import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web'
import { Context } from 'egg'

@Provide()
export class NotFoundMiddleware implements IWebMiddleware {
  resolve () {
    return async (ctx: Context, next: IMidwayWebNext) => {
      await next()
      if (ctx.status === 404) {
        ctx.redirect('/404')
      }
    }
  }
}
