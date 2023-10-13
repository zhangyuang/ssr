import { ReactNestFetch } from 'ssr-types'
import { IndexData } from '~/typings/data'
import { useValtio } from 'ssr-common-utils'

const fetch: ReactNestFetch<{
  apiService: {
    index: () => Promise<IndexData>
  }
}> = async ({ ctx, routerProps }) => {
  const { indexState } = useValtio()
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx!.apiService?.index()
  indexState.indexData = data
}

export default fetch
