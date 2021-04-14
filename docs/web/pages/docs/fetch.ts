import { ISSRContext } from 'ssr-types'
import { IndexData } from '@/interface'
interface IApiService {
  index: () => Promise<IndexData>
}

export default async ({ store, router }, ctx?: ISSRContext<{
  apiService?: IApiService
}>) => {
  let data
  if (__isBrowser__) {
    console.log(router)
    const path = router.path.replace('/docs', '')
    data = (await import(`../../docs/${path}.md`)).default
    // console.log()
  } else {
    const page = ctx?.params.page
    // eslint-disable-next-line
    data = require(`@/docs/${page}.md`).default
  }
  return {
    docsContent: data
  }
}
