import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'
import { render } from 'ssr-core-react'
import { IApiService, IApiDetailService } from './interface'

interface IFaaSContext extends FaaSContext {
  apiService: IApiService
  apiDeatilservice: IApiDetailService
}

@provide()
@func('index.handler')
export class Index implements FunctionHandler {
  @inject()
  ctx: IFaaSContext

  @inject('ApiService')
  apiService: IApiService

  @inject('ApiDetailService')
  apiDeatilservice: IApiDetailService

  async handler (): Promise<String> {
    try {
      this.ctx.apiService = this.apiService
      this.ctx.apiDeatilservice = this.apiDeatilservice
      const htmlStr = await render(this.ctx)
      return htmlStr
    } catch (error) {
      console.log(error)
      return JSON.stringify(error)
    }
  }
}
