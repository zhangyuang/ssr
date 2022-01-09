import { Store } from 'vuex'
import { Route } from 'vue-router'
import { ISSRMidwayContext } from 'ssr-types'

interface Params {
  store: Store<any>
  router: Route
}

export default async ({ store, router }: Params, ctx?: ISSRMidwayContext) => {

}
