import { ISSRContext } from 'ssr-types'
import { config } from './config'

export default async ({ router }, ctx?: ISSRContext) => {
  const path = __isBrowser__ ? router.path.replace(/\$/g, '/').replace('/docs/', '') : ctx?.params.page.replace(/\$/g, '/')
  let data
  if (__isBrowser__) {
    // compatible vite mode
    data = (await import(`../../markdown/${path}.md`)).default
  } else {
    // eslint-disable-next-line
    data = require(`@/markdown/${path}.md`).default
  }
  return {
    docsContent: data,
    pagePath: path,
    config
  }
}
