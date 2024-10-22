import { useStore } from 'ssr-common-utils'
import { ReactNestFetch } from 'ssr-types'
import { Ddata } from '~/typings/data'

const fetch: ReactNestFetch<
	{
		apiDeatilservice: {
			index: (id: string) => Promise<Ddata>
		}
	},
	{ id: string }
> = async ({ ctx, routerProps }) => {
	const { detailState } = useStore()
	const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${routerProps!.match.params.id}`)).json() : await ctx!.apiDeatilservice.index(ctx!.request.params.id)
	detailState.detailData = data
}
export default fetch
