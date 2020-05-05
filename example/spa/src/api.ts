import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'
import { IApiService } from './interface/api'

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
