import { ISSRContext } from 'ssr-types'

export default async ({ store, router }, ctx?: ISSRContext) => {
  let data = ''
  let path
  let config
  if (__isBrowser__) {
    path = router.path.replace(/\$/g, '/').replace('/docs/', '')
    data = (await import(`../../markdown/${path}.md`)).default
    config = (await import('./config')).default
  } else {
    path = ctx?.params.page.replace(/\$/g, '/')
    // eslint-disable-next-line
    data = require(`@/markdown/${path}.md`).default
    // eslint-disable-next-line
    config = require('./config').default
  }
  return {
    docsContent: data,
    pagePath: path,
    config
  }
}
