import { proxyOptions } from 'ssr-types'
import { getDevProxyMiddlewaresArr } from './proxy'

const initialSSRDevProxy = (app: any, options?: proxyOptions) => {
  const proxyMiddlewaresArr = getDevProxyMiddlewaresArr(options)
  for (const middleware of proxyMiddlewaresArr) {
    app.use(middleware)
  }
}
export {
  initialSSRDevProxy
}

export * from './proxy'
