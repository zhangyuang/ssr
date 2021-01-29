import { createProxyMiddleware } from 'http-proxy-middleware'
import { loadConfig } from '../loadConfig'

const koaConnect = require('koa2-connect')

type Path = '/static' | '/sockjs-node' | '/*.hot-update.js(on)?' | '/__webpack_dev_server__' | '/asset-manifest'
function onProxyReq (proxyReq: any, req: any) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key])
  })
}

const getDevProxyMiddlewaresArr = () => {
  const { fePort, proxy } = loadConfig()

  const remoteStaticServerOptions = {
    target: `http://127.0.0.1:${fePort}`,
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
  const proxyMiddlewaresArr = []

  for (const path in proxyPathMap) {
    const options = proxyPathMap[path as Path]
    proxyMiddlewaresArr.push(koaConnect(createProxyMiddleware(path, options)))
  }

  if (proxy) {
    proxyMiddlewaresArr.push(koaConnect(createProxyMiddleware(proxy)))
  }
  return proxyMiddlewaresArr
}

export {
  getDevProxyMiddlewaresArr
}
