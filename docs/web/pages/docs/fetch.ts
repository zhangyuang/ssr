import { ISSRContext } from 'ssr-types'
import { config } from './config'

export default async ({ router }, ctx?: ISSRContext) => {
  const path = router.path.replace(/\$/g, '/').replace('/docs/', '')
  let data
  if (__isBrowser__) {
    data = (await import(`../../markdown/${path}.md`)).default
  } else {
    data = require(`../../markdown/${path}.md`).default
  }
  return {
    docsContent: data,
    pagePath: path,
    config
  }
}
