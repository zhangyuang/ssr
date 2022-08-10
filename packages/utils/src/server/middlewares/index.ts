import type { proxyOptions } from 'ssr-types'
import { getDevProxyMiddlewaresArr } from './proxy'

const initialSSRDevProxy = async (app: any, options?: proxyOptions) => {
  if (process.env.NODE_ENV === 'production') return
  // 在本地开发阶段代理 serverPort 的资源到 fePort
  // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8999/static/js/page.chunk.js
  const proxyMiddlewaresArr = await getDevProxyMiddlewaresArr()
  for (const middleware of proxyMiddlewaresArr) {
    app.use(middleware)
  }
}
export {
  initialSSRDevProxy
}

export * from './proxy'
