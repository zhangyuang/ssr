import { Inject, Controller, Provide, Get } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { IApiService, IApiDetailService } from '../interface'

@Provide()
@Controller('/api')
export class Api {
  @Inject()
  ctx: Context

  @Inject('ApiService')
  service: IApiService

  @Inject('ApiDetailService')
  detailService: IApiDetailService

  @Get('/index')
  async getIndexData () {
    const data = await this.service.index()
    return data
  }

  @Get('/detail/:id')
  async getDetailData () {
    const { ctx, detailService } = this
    const id = ctx.params.id
    const data = await detailService.index(id)
    return data
  }
}
