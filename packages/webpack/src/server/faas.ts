import { useKoaDevPack } from '@midwayjs/faas-dev-pack'
import * as Koa from 'koa'
import { logGreen, getCwd } from 'ssr-server-utils'
import { buildConfig } from '../config'

const proxy = require('koa-proxy')
const { port, faasPort } = buildConfig

const app = new Koa()

const startFaasServer = () => {
  const cwd = getCwd()

  app.use(proxy({
    host: `http://127.0.0.1:${port}`, // 本地开发的时候代理前端打包出来的资源地址
    match: /(\/static)|(\/sockjs-node)|hot-update/
  }))

  app.use(useKoaDevPack({
    functionDir: cwd
  }))

  app.listen(faasPort, () => {
    logGreen('Server is listening on http://localhost:3000')
  })

}

export {
  startFaasServer
}
