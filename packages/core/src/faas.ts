import { join } from 'path'
import { invoke } from '@midwayjs/serverless-invoke'
import { isDev, port } from 'ssr-webpack-config'
import { getCwd, Argv, findRoute, FaasRouteItem } from 'ssr-server-utils'

const Koa = require('koa')
const Router = require('koa-router')
const proxy = require('koa-proxy')
const serverStatic = require('koa-static')

const startFaasServer = (argv: Argv) => {
  const app = new Koa()
  const router = new Router()
  const cwd = getCwd()

  router.get('/*', async (ctx, next) => {
    await next()
    const routeItem = findRoute<FaasRouteItem>(argv.faasRoutes, ctx.path)
    const { funcName } = routeItem

    try {
      const result: any = await invoke({
        functionName: funcName,
        functionDir: cwd,
        data: [
          {
            path: ctx.req.path,
            method: 'GET'
          }
        ]
      })
      ctx.type = 'text/html'
      ctx.body = result.body
    } catch (error) {
      ctx.body = JSON.stringify(error)
    }
  })

  router.get('/*', async (ctx, next) => {
    await next()
    const routeItem = findRoute<FaasRouteItem>(argv.faasRoutes, ctx.path)
    const { funcName } = routeItem
    serverStatic(join(cwd, `${cwd}/build/${funcName}`))
  })

  app
  .use(router.routes())
  .use(router.allowedMethods())
  if (isDev) {
    app.use(proxy({
      host: `http://127.0.0.1:${port}`, // 本地开发的时候代理前端打包出来的资源地址
      match: /(\/static)|(\/sockjs-node)|hot-update/
    }))
  }

  app.listen(3000, () => {
    console.log('server is listening on http://localhost:3000')
  })

}

export {
  startFaasServer
}
