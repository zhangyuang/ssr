import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'

@provide()
@func('spa.handler')
export class SpaService implements FunctionHandler {

  @inject()
  ctx: FaaSContext  // context

  async handler () {
    return 'hello world'
  }
}
