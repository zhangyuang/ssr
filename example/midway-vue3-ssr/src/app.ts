// import { initialSSRDevProxy } from 'ssr-server-utils'
import { Application } from 'egg'
import { join } from 'path'
const c2k = require('koa-connect')

class AppBootHook {
  app: Application
  constructor (app) {
    this.app = app
  }

  async didReady () {
    const cwd = join(process.cwd(), './web')
    const vite = await require('vite').createServer({
      cwd,
      logLevel: 'info',
      server: {
        middlewareMode: true
      }
    })
    // 本地开发请求走 vite
    this.app.use(c2k(vite.middlewares))

    // use vite's connect instance as middleware
    // initialSSRDevProxy(this.app)
  }
}

export default AppBootHook
