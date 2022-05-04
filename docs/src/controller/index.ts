import { Readable } from 'stream'
import { Controller, Get, Provide, Inject } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { render } from 'ssr-core-vue3'

@Provide()
@Controller('/')
export class Index {
  @Inject()
  ctx: Context

  @Get('/')
  @Get('/docs/:page')
  @Get('/blog')
  @Get('/blog:router')
  async handler (): Promise<void> {
    try {
      const stream = await render<Readable>(this.ctx, {
        stream: true
      })
      this.ctx.body = stream
    } catch (error) {
      console.log(error)
      this.ctx.body = error
    }
  }
}
