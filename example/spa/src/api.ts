import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'
import { IApiService, IApiDetailService } from './interface'

@provide()
@func('api.handler')
export class Api implements FunctionHandler {

  @inject()
  ctx: FaaSContext

  @inject('ApiService')
  service: IApiService

  async handler () {
    try {
      const data = await this.service.index()
      return data
    } catch (error) {
      return error
    }
  }
}

@provide()
@func('api.detail.handler')
export class ApiDetail implements FunctionHandler {

  @inject()
  ctx: FaaSContext

  @inject('ApiDetailService')
  service: IApiDetailService

  async handler () {
    try {
      const id = /detail\/(.*)(\?|\/)?/.exec(this.ctx.req.path)[1]
      const data = await this.service.index(id)
      return data
    } catch (error) {
      console.log(error)
    }
  }
}
