import { Provide } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web'
import { Context } from 'egg'
import { format } from 'date-fns'

@Provide()
export class ReportMiddleware implements IWebMiddleware {
  resolve () {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const startTime = Date.now()
      await next()
      if (!/\.\w+$/.test(ctx.request.url)) {
        console.log(`\n${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} ${ctx.request.method} ${ctx.request.url} ${Date.now() - startTime}ms`)
        console.log('\n###########################################################')
      }
    }
  }
}
