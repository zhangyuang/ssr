import { ISSRContext } from 'ssr-types'

export default async ({ store, router }, ctx?: ISSRContext) => {
  let data
  if (__isBrowser__) {
    const path = router.path.replace(/\$/g, '/').replace('/docs/', '')
    data = (await import(`@/markdown/${path}.md`)).default
  } else {
    const path = ctx?.params.page.replace(/\$/g, '/')
    // eslint-disable-next-line
    data = require(`@/markdown/${path}.md`).default
  }
  return {
    docsContent: data
  }
}
