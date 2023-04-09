import { h, createSSRApp, renderSlot, VNode } from 'vue'
import {
  findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk,
  getUserScriptVue, remInitial, localStorageWrapper, appLocalStoreageWrapper,
  checkRoute, getInlineCss
} from 'ssr-common-utils'
import type { ISSRContext, IConfig } from 'ssr-types'
import { createPinia } from 'pinia'
import { serialize } from 'ssr-serialize-javascript'
import { renderToNodeStream, renderToString } from '@vue/server-renderer'
import { Routes } from './combine-router'
import { createRouter, createStore } from './create'
import { IFeRouteItem, vue3AppParams } from '../types'

const { FeRoutes, App, layoutFetch, Layout } = Routes

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { mode, customeHeadScript, customeFooterScript, parallelFetch, prefix, isVite, isDev, clientPrefix, stream, fePort, https } = config
  const store = createStore()
  const router = createRouter()
  const pinia = createPinia()
  const rawPath = ctx.request.path ?? ctx.request.url
  const [path, url] = [normalizePath(rawPath, prefix), normalizePath(ctx.request.url, prefix)]
  const routeItem = findRoute<IFeRouteItem>(FeRoutes, path)
  checkRoute({ routeItem, path })

  const getApp = ({
    combineAysncData,
    state,
    layoutFetchData,
    asyncData,
    manifest,
    isCsr,
    jsInject,
    cssInject,
    inlineCss
  }: vue3AppParams) => {
    const app = createSSRApp({
      render: function () {
        const ssrDevInfo = { manifest, fePort: isDev ? fePort : '', https: isDev ? https : '' }
        const commonInject = `window.__USE_VITE__=${isVite}; window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}"` : ''};window.ssrDevInfo=${JSON.stringify(ssrDevInfo)}`
        const initialData = !isCsr ? h('script', {
          innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ = ${serialize(state)};window.__INITIAL_PINIA_DATA__ = ${serialize(pinia.state.value)};${commonInject}`
        }) : h('script', { innerHTML: commonInject })
        const children = h(App, { ctx, config, asyncData, fetchData: combineAysncData, reactiveFetchData: { value: combineAysncData }, ssrApp: app })
        const customeHeadScriptArr: VNode[] = getUserScriptVue(customeHeadScript, ctx, h, 'vue3').concat(inlineCss ?? [])
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
    return app
  }

  const fn = async () => {
    const { fetch, webpackChunkName } = routeItem
    const dynamicCssOrder = await getAsyncCssChunk(ctx, webpackChunkName, config)
    const dynamicJsOrder = await getAsyncJsChunk(ctx, webpackChunkName, config)
    const manifest = await getManifest(config)
    const [inlineCss, extraCssOrder] = await getInlineCss({ dynamicCssOrder, manifest, h, config, type: 'vue3' })
    const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

    const cssInject = ((isVite && isDev) ? [h('script', {
      type: 'module',
      src: '/@vite/client'
    })] : extraCssOrder.map(css => manifest[css]).filter(Boolean).map(css => h('link', {
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
    let [layoutFetchData, fetchData] = [{}, {}]
    if (!isCsr) {
      router.push(url)
      await router.isReady()
      const currentFetch = fetch ? (await fetch()).default : null
      const { value } = router.currentRoute
      const lF = layoutFetch ? layoutFetch({ store, router: value, ctx, pinia }, ctx) : Promise.resolve({})
      const CF = currentFetch ? currentFetch({ store, router: value, ctx, pinia }, ctx) : Promise.resolve({});
      [layoutFetchData, fetchData] = parallelFetch ? await Promise.all([lF, CF]) : [await lF, await CF]
    } else {
      logGreen(`Current path ${path} use csr render mode`)
    }
    const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})

    const asyncData = {
      value: combineAysncData
    }

    const state = Object.assign({}, store.state ?? {}, asyncData.value)

    const app = getApp({
      state,
      asyncData,
      layoutFetchData,
      combineAysncData,
      manifest,
      jsInject,
      cssInject,
      isCsr,
      inlineCss
    })
    app.use(router)
    app.use(store)
    app.use(pinia)

    const res = await appLocalStoreageWrapper.run({
      app
    }, async () => {
      if (stream) {
        return renderToNodeStream(app)
      } else {
        const teleportsContext: {
          teleports?: Record<string, string>
        } = {}
        const html = await renderToString(app, teleportsContext)
        return ({
          html,
          teleportsContext
        })
      }
    })
    return res
  }
  const res = await localStorageWrapper.run({
    pinia,
    store
  }, fn)
  return res
}

export {
  serverRender,
  Routes
}
