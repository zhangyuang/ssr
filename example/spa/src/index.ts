import { FaaSContext, func, inject, provide, FunctionHandler } from '@midwayjs/faas'
// import { render } from 'ssr-core'

@provide()
@func('index.handler')
export class IndexService implements FunctionHandler {

  @inject()
  ctx: FaaSContext  // context

  async handler () {
    console.log('xx')
    // const str = await render(this.ctx)
    return 'xx'
  }
}
