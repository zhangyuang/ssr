import { Provide, Func } from '@midwayjs/decorator'

@Provide()
export class RenderService {

  @Func('render.handler', { middleware: [ '@midwayjs/faas-middleware-static:staticFile' ] })
  async handler () {
    return 'Building... Please refresh this page later.'
  }
}
