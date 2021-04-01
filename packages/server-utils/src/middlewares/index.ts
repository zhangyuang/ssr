import { proxyOptions } from 'ssr-types'
import { getDevProxyMiddlewaresArr } from './proxy'
const initialSSRDevProxy = (app: any, options?: proxyOptions) => {
  // 在本地开发阶段代理 serverPort 的资源到 fePort
  // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8000/static/js/page.chunk.js
  const { isDev } = loadConfig()
  console.log(isDev)
  if (isDev) {
    const proxyMiddlewaresArr = getDevProxyMiddlewaresArr(options)
    proxyMiddlewaresArr.then((arr) => {
      for (const middleware of arr) {
        app.use(middleware)
      }
    })
  }
}
export {
  initialSSRDevProxy
}

export * from './proxy'
