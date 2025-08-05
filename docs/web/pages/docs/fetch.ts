import { ISSRContext } from 'ssr-types'
import { config } from './config'

export default async ({ router }, ctx?: ISSRContext) => {
  const path = router.path.replace(/\$/g, '/').replace('/docs/', '')
  const data = (await import(`@/markdown/${path}.md`)).default
  
  if (__isBrowser__) {
    if (path === 'features/v7') {
      document.title = 'ssr框架v7发布，全网首个同时支持Rspack,Rolldown-Vite,Webpack的ssr框架'
    } else {
      document.title = 'ssr 框架官方文档'
    }
  }
  return {
    docsContent: data,
    pagePath: path,
    config
  }
}
