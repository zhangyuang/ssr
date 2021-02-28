import { createProxyMiddleware } from 'http-proxy-middleware'
import { Proxy, proxyOptions } from 'ssr-types'
import { loadConfig } from '../loadConfig'

const koaConnect = require('koa2-connect')

function onProxyReq (proxyReq: any, req: any) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key])
  })
}

const getDevProxyMiddlewaresArr = (options?: proxyOptions) => {
  const { fePort, proxy } = loadConfig()
  const express = options ? options.express : false
  const remoteStaticServerOptions = {
    target: `http://127.0.0.1:${fePort}`,
    changeOrigin: true,
    secure: false,
    onProxyReq,
    logLevel: 'warn'
  }
  function registerProxy (proxy: Proxy) {
    for (const path in proxy) {
      const options = proxy[path]
      // 如果底层服务端框架是基于 express的。则不需要用 koaConnect 转换为 koa 中间件
      const middleware = express ? createProxyMiddleware(path, options) : koaConnect(createProxyMiddleware(path, options))
      proxyMiddlewaresArr.push(middleware)
    }
  }
  const proxyPathMap = {
    '/static': remoteStaticServerOptions,
    '/sockjs-node': remoteStaticServerOptions,
    '/*.hot-update.js(on)?': remoteStaticServerOptions,
    '/__webpack_dev_server__': remoteStaticServerOptions,
    '/asset-manifest': remoteStaticServerOptions
  }
  const proxyMiddlewaresArr: any[] = []

  registerProxy(proxyPathMap)
  proxy && registerProxy(proxy)

  return proxyMiddlewaresArr
}

export {
  getDevProxyMiddlewaresArr
}
