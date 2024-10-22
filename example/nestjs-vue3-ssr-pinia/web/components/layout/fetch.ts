import { ISSRMidwayContext } from 'ssr-types'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { Store } from 'vuex'

interface Params {
	store: Store<any>
	router: RouteLocationNormalizedLoaded
}

export default async ({ store, router }: Params, _ctx?: ISSRMidwayContext) => {}
