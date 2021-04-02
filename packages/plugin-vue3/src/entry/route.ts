// import Layout from '@/components/layout/index.vue'
// import App from '@/components/layout/App.vue'
import FetchA from '@/pages/detail/fetch.ts'
import FetchB from '@/pages/index/fetch.ts'
// import componentA from '@/pages/detail/render$id.vue'
// import componentB from '@/pages/index/render.vue'
// __isBrowser__ ? () => import(/* webpackChunkName: "index" */ '@/pages/index/render.vue')
export default [{
  layout: __isBrowser__ ? async () => await import(/* webpackChunkName: "index" */ '@/components/layout/index.vue') : require('@/components/layout/index.vue').default,
  App: __isBrowser__ ? async () => await import(/* webpackChunkName: "index" */ '@/components/layout/App.vue') : require('@/components/layout/App.vue').default,
  fetch: __isBrowser__ ? async () => await import('@/pages/detail/fetch.ts') : require('@/pages/detail/fetch.ts').default,
  path: '/detail/:id',
  component: __isBrowser__ ? async () => await import(/* webpackChunkName: "index" */ '@/pages/detail/render$id.vue') : require('@/pages/detail/render$id.vue').default
},
{
  layout: __isBrowser__ ? async () => await import(/* webpackChunkName: "index" */ '@/components/layout/index.vue') : require('@/components/layout/index.vue').default,
  App: __isBrowser__ ? async () => await import(/* webpackChunkName: "index" */ '@/components/layout/App.vue') : require('@/components/layout/App.vue').default,
  fetch: __isBrowser__ ? async () => await import('@/pages/index/fetch.ts') : require('@/pages/index/fetch.ts').default,
  path: '/',
  component: __isBrowser__ ? async () => await import(/* webpackChunkName: "index" */ '@/pages/index/render.vue') : require('@/pages/index/render.vue').default
}]
