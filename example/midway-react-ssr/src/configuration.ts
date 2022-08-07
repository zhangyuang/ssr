import { Configuration, App } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import { join } from 'path'
import { initialSSRDevProxy, getCwd } from 'ssr-common-utils'

const koaStatic = require('koa-static-cache')
const cwd = getCwd()

@Configuration({
  imports: [
    koa
  ],
  importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady () {
    this.app.use(koaStatic(join(cwd, './build')))
    this.app.use(koaStatic(join(cwd, './public')))
    this.app.use(koaStatic(join(cwd, './build/client')))

    await initialSSRDevProxy(this.app)
  }
}
