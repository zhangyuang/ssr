
import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web'
import { Context } from 'egg'

@Provide()
export class Index implements IWebMiddleware {
  resolve () {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const BASE_NAME = ctx.cookies.get('BASE_NAME')
      if (BASE_NAME) {
        ctx.redirect(BASE_NAME)
      } else {
        ctx.redirect('/en')
      }
      // await next();
    }
  }
}
