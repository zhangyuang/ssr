import { join } from 'path'
import { App, Configuration } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import { getCwd, initialSSRDevProxy } from 'ssr-common-utils'

const koaStatic = require('koa-static-cache')
const cwd = getCwd()

@Configuration({
	imports: [koa],
	importConfigs: [join(__dirname, './config')]
})
export class ContainerLifeCycle {
	@App()
	app: koa.Application

	async onReady() {
		this.app.use(koaStatic(join(cwd, './build'), { maxAge: 864000 }))
		this.app.use(koaStatic(join(cwd, './public'), { maxAge: 864000 }))
		this.app.use(koaStatic(join(cwd, './build/client'), { maxAge: 864000 }))

		await initialSSRDevProxy(this.app)
	}
}
