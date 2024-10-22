import { Params } from '~/typings/data'

export default async ({ store, router, ctx }: Params) => {
	const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${router.params.id}`)).json() : await ctx?.apiDeatilservice?.index(ctx.params.id)
	await store.dispatch('detailStore/initialData', { payload: data })
}
