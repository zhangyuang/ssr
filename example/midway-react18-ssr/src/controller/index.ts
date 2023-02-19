
import { PassThrough } from 'stream'
import { Controller, Get, Provide, Inject } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { render } from 'ssr-core-react'
import { IApiService, IApiDetailService } from '../interface'

interface IKoaContext extends Context {
  apiService: IApiService
  apiDeatilservice: IApiDetailService
}

@Provide()
@Controller('/')
export class Index {
  @Inject()
  ctx: IKoaContext

  @Inject('ApiService')
  apiService: IApiService

  @Inject('ApiDetailService')
  apiDeatilservice: IApiDetailService

  @Get('/')
  @Get('/detail/:id')
  async handler (): Promise<void> {
    // 降级策略参考文档 http://doc.ssr-fc.com/docs/features$csr#%E5%A4%84%E7%90%86%20%E6%B5%81%20%E8%BF%94%E5%9B%9E%E5%BD%A2%E5%BC%8F%E7%9A%84%E9%99%8D%E7%BA%A7
    const { ctx } = this
    ctx.apiService = this.apiService
    ctx.apiDeatilservice = this.apiDeatilservice
    const stream = await render(ctx, {
      stream: true,
      onError: (err) => {
        // console.log('ssr error', err)
        render(ctx, {
          stream: false,
          mode: 'csr'
        }).then(csrStr => {
          ctx.res.end('213123')
        })
        return null
      }
    })
    ctx.body = stream
  }
}
