import { ISSRContext } from 'ssr-types'

export default async ({ store, router }, ctx?: ISSRContext) => {
  let data = ''
  let path
  if (__isBrowser__) {
    path = router.path.replace(/\$/g, '/').replace('/docs/', '')
    data = (await import(`../../markdown/${path}.md`)).default
  } else {
    path = ctx?.params.page.replace(/\$/g, '/')
    // eslint-disable-next-line
    data = require(`@/markdown/${path}.md`).default
  }
  return {
    docsContent: data,
    pagePath: path
  }
}
