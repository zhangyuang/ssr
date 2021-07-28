import { ISSRContext } from 'ssr-types'
import { config } from './config'

export default async ({ router }, ctx?: ISSRContext) => {
  const path = router.path.replace(/\$/g, '/').replace('/docs/', '')
  const data = (await import(`../../markdown/${path}.md`)).default
  return {
    docsContent: data,
    pagePath: path,
    config
  }
}
