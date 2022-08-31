import { h, createSSRApp, renderSlot, VNode } from 'vue'
import {
  findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk,
  getUserScriptVue, remInitial, setStore, setPinia, setApp
} from 'ssr-common-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import { createPinia } from 'pinia'
import { serialize } from 'ssr-serialize-javascript'
import { Routes } from './combine-router'
import { createRouter, createStore } from './create'
import { IFeRouteItem } from '../types'

const { FeRoutes, App, layoutFetch, Layout } = Routes

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { mode, customeHeadScript, customeFooterScript, parallelFetch, prefix, isVite, isDev, clientPrefix } = config
  const store = createStore()
  const router = createRouter()
  const pinia = createPinia()
  setStore(store)
  setPinia(pinia)
  const [path, url] = [normalizePath(ctx.request.path, prefix), normalizePath(ctx.request.url, prefix)]
  const routeItem = findRoute<IFeRouteItem>(FeRoutes, path)

  if (!routeItem) {
    throw new Error(`
    With Path: ${path} search component failed
    If you create new folder or component file, please restart server by npm start
    `)
  }

  const { fetch, webpackChunkName } = routeItem
  const dynamicCssOrder = await getAsyncCssChunk(ctx, webpackChunkName, config)
  const dynamicJsOrder = await getAsyncJsChunk(ctx, webpackChunkName, config)
  const manifest = await getManifest(config)
  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

  const cssInject = ((isVite && isDev) ? [h('script', {
    type: 'module',
    src: '/@vite/client'
  })] : dynamicCssOrder.map(css => manifest[css]).filter(Boolean).map(css => h('link', {
    rel: 'stylesheet',
    href: css
  }))).concat((isVite && isDev) ? [] : dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(js => h('link', {
    href: js,
    as: 'script',
    rel: isVite ? 'modulepreload' : 'preload'
  })))

  const jsInject = (isVite && isDev) ? [h('script', {
    type: 'module',
    src: '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'
  })] : dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(js =>
    h('script', {
      src: js,
      type: isVite ? 'module' : 'text/javascript'
    })
  )

  const app = createSSRApp({
    render: function () {
      const commonInject = `window.__USE_VITE__=${isVite}; window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}"` : ''}`
      const initialData = !isCsr ? h('script', {
        innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ = ${serialize(state)};window.__INITIAL_PINIA_DATA__ = ${serialize(pinia.state.value)};${commonInject}`
      }) : h('script', { innerHTML: commonInject })
      const children = h(App, { ctx, config, asyncData, fetchData: combineAysncData, reactiveFetchData: { value: combineAysncData }, ssrApp: app })
      const customeHeadScriptArr: VNode[] = getUserScriptVue(customeHeadScript, ctx, h, 'vue3')
      const customeFooterScriptArr: VNode[] = getUserScriptVue(customeFooterScript, ctx, h, 'vue3')

      return h(Layout,
        { ctx, config, asyncData, fetchData: layoutFetchData, reactiveFetchData: { value: layoutFetchData } },
        {
          remInitial: () => h('script', { innerHTML: remInitial }),

          customeHeadScript: () => customeHeadScriptArr,

          customeFooterScript: () => customeFooterScriptArr,

          children: () => children,

          initialData: () => initialData,

          cssInject: () => cssInject,

          jsInject: () => jsInject,

          injectHeader: () => [
            customeHeadScriptArr,
            cssInject
          ],

          content: () => [
            h('div', {
              id: 'app'
            }, renderSlot(this.$slots, 'default', {}, () => [children])),
            initialData,
            customeFooterScriptArr,
            jsInject
          ]
        }
      )
    }
  })

  app.use(router)
  app.use(store)
  app.use(pinia)
  setApp(app)

  let [layoutFetchData, fetchData] = [{}, {}]

  if (!isCsr) {
    router.push(url)
    await router.isReady()
    const currentFetch = fetch ? (await fetch()).default : null
    const { value } = router.currentRoute
    const lF = layoutFetch ? layoutFetch({ store, router: value, ctx: ctx as any, pinia }, ctx) : Promise.resolve({})
    const CF = currentFetch ? currentFetch({ store, router: value, ctx: ctx as any, pinia }, ctx) : Promise.resolve({});
    [layoutFetchData, fetchData] = parallelFetch ? await Promise.all([lF, CF]) : [await lF, await CF]
  } else {
    logGreen(`Current path ${path} use csr render mode`)
  }
  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})

  const asyncData = {
    value: combineAysncData
  }

  const state = Object.assign({}, store.state ?? {}, asyncData.value)

  return app
}

export {
  serverRender
}
