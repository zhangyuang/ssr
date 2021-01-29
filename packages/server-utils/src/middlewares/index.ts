import { loadConfig } from '../loadConfig'
import { getDevProxyMiddlewaresArr } from './proxy'

const initialSSRDevProxy = (app: any) => {
  const { isDev } = loadConfig()
  if (isDev) {
    const proxyMiddlewaresArr = getDevProxyMiddlewaresArr()
    for (const middleware of proxyMiddlewaresArr) {
      app.use(middleware)
    }
  }
}
export {
  initialSSRDevProxy
}

export * from './proxy'
