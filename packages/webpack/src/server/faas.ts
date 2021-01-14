import { useKoaDevPack } from '@midwayjs/faas-dev-pack'
import * as Koa from 'koa'
import { logGreen, getCwd } from 'ssr-server-utils'
import { buildConfig } from '../config'

const { createProxyMiddleware } = require('http-proxy-middleware')
const koaConnect = require('koa2-connect')

const { port, faasPort, cloudIDE, proxy } = buildConfig

const app = new Koa()
const cwd = getCwd()
function onProxyReq (proxyReq: any, req: Koa.Request) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key])
  })
}
const remoteStaticServerOptions = {
  target: `http://127.0.0.1:${port}`,
  changeOrigin: true,
  secure: false,
  onProxyReq
}
const proxyPathMap = {
  '/static': remoteStaticServerOptions,
  '/sockjs-node': remoteStaticServerOptions,
  '/*.hot-update.js(on)?': remoteStaticServerOptions,
  '/__webpack_dev_server__': remoteStaticServerOptions,
  '/asset-manifest': remoteStaticServerOptions
}
type Path = '/static' | '/sockjs-node' | '/*.hot-update.js(on)?' | '/__webpack_dev_server__' | '/asset-manifest'

const startFaasServer = () => {
  for (const path in proxyPathMap) {
    const options = proxyPathMap[path as Path]
    app.use(koaConnect(createProxyMiddleware(path, options)))
  }

  if (proxy) {
    // custom proxy
    app.use(koaConnect(createProxyMiddleware(proxy)))
  }

  app.use(useKoaDevPack({
    functionDir: cwd
  }))

  app.listen(faasPort, () => {
    if (cloudIDE && process.env.HOSTNAME) {
      // cloud ide 在云端启动服务
      const hostName = process.env.HOSTNAME
      if (hostName) {
        logGreen(`Server is listening on http://${hostName.split('-').slice(0, -2).join('-')}-3000.xide.aliyun.com/`)
      }
    } else {
      logGreen('Server is listening on http://localhost:3000')
    }
  })
}

export {
  startFaasServer
}
