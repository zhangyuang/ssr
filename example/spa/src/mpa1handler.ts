import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'

@provide()
@func('index.handler')
export class IndexService implements FunctionHandler {

  @inject()
  ctx: FaaSContext  // context

  async handler () {
    return 'hello world'
  }
}
