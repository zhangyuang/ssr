import { useStore } from 'ssr-common-utils'
import { ReactNestFetch } from 'ssr-types'
import { IndexData } from '~/typings/data'

const fetch: ReactNestFetch<{
	apiService: {
		index: () => Promise<IndexData>
	}
}> = async ({ ctx, routerProps }) => {
	const { indexState } = useStore()
	const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx!.apiService?.index()
	indexState.indexData = data
}

export default fetch
