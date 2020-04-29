import { useKoaDevPack } from '@midwayjs/faas-dev-pack'
import * as Koa from 'koa'
import { logGreen, getCwd } from 'ssr-server-utils'
import { buildConfig } from '../config'

const proxy = require('koa-proxy')
const { port, faasPort, cloudIDE } = buildConfig

const app = new Koa()

const startFaasServer = () => {
  if (cloudIDE && process.env.HOSTNAME) {
    // cloud ide 在云端启动服务
    const hostName = process.env.HOSTNAME
    if (hostName) {
      logGreen(`Server is listening http://${hostName.split('-').slice(0,-2).join('-')}-3000.xide.aliyun.com/`)
    }
    return
  }
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
