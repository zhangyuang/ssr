import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'
import { render } from 'ssr-core'
import { IApiService } from './interface/api'

interface IFaaSContext extends FaaSContext {
  apiService: IApiService
}

@provide()
@func('index.handler', { middleware: [ '@midwayjs/faas-middleware-static:staticFile' ] })
export class Index implements FunctionHandler {

  @inject()
  ctx: IFaaSContext

  @inject('ApiService')
  service: IApiService

  async handler () {
    try {
      this.ctx.apiService = this.service
      const htmlStr = await render(this.ctx)
      return htmlStr
    } catch (error) {
      console.log(error)
    }
  }
}
