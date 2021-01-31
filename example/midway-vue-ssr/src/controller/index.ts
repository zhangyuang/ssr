import { Controller, Get, Provide, Inject } from '@midwayjs/decorator'
import { Context } from 'egg'
import { render } from 'ssr-core-vue'
import { IApiService, IApiDetailService } from '../interface'

interface IEggContext extends Context {
  apiService: IApiService
  apiDeatilservice: IApiDetailService
}

@Provide()
@Controller('/')
export class Index {
  @Inject()
  ctx: IEggContext

  @Inject('ApiService')
  apiService: IApiService

  @Inject('ApiDetailService')
  apiDeatilservice: IApiDetailService

  @Get('/')
  @Get('/detail/:id')
  async handler (): Promise<void> {
    try {
      this.ctx.apiService = this.apiService
      this.ctx.apiDeatilservice = this.apiDeatilservice
      // @ts-expect-error
      const stream = await render(this.ctx, {
        stream: false
      })
      this.ctx.body = stream
    } catch (error) {
      console.log(error)
      this.ctx.body = error
    }
  }
}
