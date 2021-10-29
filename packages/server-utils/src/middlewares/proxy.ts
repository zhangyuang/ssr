import { createProxyMiddleware } from 'http-proxy-middleware'
import { proxyOptions } from 'ssr-types'
import { ViteDevServer } from 'vite'
import { getCwd } from '../cwd'
import { loadConfig } from '../loadConfig'

function onProxyReq (proxyReq: any, req: any) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key])
  })
}

let viteServer: ViteDevServer|null = null

const getDevProxyMiddlewaresArr = async (options?: proxyOptions) => {
  const { fePort, proxy, isDev, https, proxyKey } = loadConfig()
  const express = options ? options.express : false
  const proxyMiddlewaresArr: any[] = []

  function registerProxy (proxy: any) {
    for (const path in proxy) {
      const options = proxy[path]
      // 如果底层服务端框架是基于 express的。则不需要用 koaConnect 转换为 koa 中间件
      const middleware = express ? createProxyMiddleware(path, options) : koaConnect(createProxyMiddleware(path, options))
      proxyMiddlewaresArr.push(middleware)
    }
  }
  proxy && registerProxy(proxy)
  if (isDev) {
    if (process.env['BUILD_TOOL'] === 'vite') {
      // 本地开发请求走 vite 接管 前端文件夹请求
      const { createServer } = await import('vite')
      viteServer = await createServer({
        root: getCwd(),
        logLevel: 'info',
        server: {
          middlewareMode: true
        },
        define: {
          __isBrowser__: false,
          __isVite__: true
        }
      })
      const koaConnect = require('koa2-connect')
      proxyMiddlewaresArr.push(express ? viteServer.middlewares : koaConnect(viteServer.middlewares))
    } else {
      // Webpack 场景 在本地开发阶段代理 serverPort 的资源到 fePort
      // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8888/static/js/page.chunk.js
      const remoteStaticServerOptions = {
        target: `${https ? 'https' : 'http'}://127.0.0.1:${fePort}`,
        changeOrigin: true,
        secure: false,
        onProxyReq,
        logLevel: 'warn'
      }

      const proxyPathMap: Record<string, any> = {
        '/sockjs-node': remoteStaticServerOptions,
        '/__webpack_dev_server__': remoteStaticServerOptions
      }
      for (const key of proxyKey) {
        proxyPathMap[key] = remoteStaticServerOptions
      }
      registerProxy(proxyPathMap)
    }
  }

  return proxyMiddlewaresArr
}

const getViteServer = () => viteServer

export {
  getDevProxyMiddlewaresArr,
  getViteServer
}
