
import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web'
import { Context } from 'egg'

@Provide()
export class MultiLang implements IWebMiddleware {
  resolve () {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const pathArr = ctx.request.path.split('/')
      ctx.cookies.set('BASE_NAME', `/${pathArr[1]}`, { httpOnly: false })
      ctx.session.lang = 'pathArr[1]'
      await next()
    }
  }
}
