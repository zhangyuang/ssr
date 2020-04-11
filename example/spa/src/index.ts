import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'
import { render } from 'ssr-core'

@provide()
@func('index.handler')
export class IndexService implements FunctionHandler {

  @inject()
  ctx: FaaSContext  // context

  async handler () {
    try {
      const htmlStr = await render(this.ctx)
      return htmlStr
    } catch (error) {
      return error
    }
  }
}
