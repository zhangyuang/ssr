import { h, createSSRApp, renderSlot, VNode } from 'vue'
import {
  findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk,
  getUserScriptVue, remInitial, localStorageWrapper, appLocalStoreageWrapper,
  checkRoute, getInlineOrder, splitPageInfo, getStaticConfig
} from 'ssr-common-utils'
import type { ISSRContext, IConfig } from 'ssr-types'
import { createPinia } from 'pinia'
import { serialize } from 'ssr-serialize-javascript'
import { renderToNodeStream, renderToString } from '@vue/server-renderer'
import { Routes } from './combine-router'
import { createRouter, createStore, getInlineVNode, getVNode } from './create'
import { IFeRouteItem, vue3AppParams } from '../types'

const { FeRoutes, App, layoutFetch, Layout } = Routes
const staticConfig = getStaticConfig()

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { mode, customeHeadScript, customeFooterScript, parallelFetch, prefix, isVite, isDev, fePort, https, clientPrefix, stream, rootId, bigpipe, hashRouter, asyncGlobalData } = config
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
    inlineCssOrder,
    rootId,
    inlineJsOrder
  }: vue3AppParams) => {
    const app = createSSRApp({
      render: function () {
        const ssrDevInfo = { manifest: isDev ? manifest : '', rootId, fePort: isDev ? fePort : '', https: isDev ? https : '' }
        const innerHTML = splitPageInfo({
          'window.__USE_SSR__': !isCsr,
          'window.__INITIAL_DATA__': isCsr ? {} : serialize(state),
          'window.__INITIAL_PINIA_DATA__': isCsr ? {} : serialize(pinia.state.value),
          'window.__USE_VITE__': isVite,
          'window.prefix': `"${prefix}"`,
          'window.clientPrefix': `"${clientPrefix ?? ''}"`,
          'window.ssrDevInfo': JSON.stringify(ssrDevInfo),
          'window.hashRouter': Boolean(hashRouter)
        })
        const initialData = h('script', { innerHTML })
        const children = bigpipe ? '' : h(App, { ctx, config, asyncData, fetchData: combineAysncData, reactiveFetchData: { value: combineAysncData }, ssrApp: app })
        const customeHeadScriptArr: VNode[] = getVNode(getUserScriptVue({ script: customeHeadScript, ctx, position: 'header', staticConfig })).concat(getInlineVNode(inlineCssOrder, 'style', isVite))
        const customeFooterScriptArr: VNode[] = getVNode(getUserScriptVue({ script: customeFooterScript, ctx, position: 'footer', staticConfig })).concat(getInlineVNode(inlineJsOrder, 'script', isVite))
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
                id: rootId.replace('#', '')
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
    const {
      inlineCssOrder,
      extraCssOrder,
      inlineJsOrder,
      extraJsOrder
    } = await getInlineOrder({ dynamicCssOrder, dynamicJsOrder, manifest, config, type: 'vue3' })
    const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)
    let cssInject = ((isVite && isDev) ? [h('script', {
      type: 'module',
      src: '/@vite/client'
    })] : extraCssOrder.map(css => manifest[css]).filter(Boolean).map(css => h('link', {
      rel: 'stylesheet',
      href: css
    })))
    if (!clientPrefix) {
      cssInject = cssInject.concat((isVite && isDev) ? [] : extraJsOrder.map(js => manifest[js]).filter(Boolean).map(js => h('link', {
        href: js,
        as: 'script',
        rel: isVite ? 'modulepreload' : 'preload'
      })))
    }
    const jsInject = (isVite && isDev) ? [h('script', {
      type: 'module',
      src: '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'
    })] : extraJsOrder.map(js => manifest[js]).filter(Boolean).map(js =>
      h('script', {
        src: js,
        type: isVite ? 'module' : 'text/javascript'
      })
    )
    let [layoutFetchData, fetchData] = [{}, {}]
    if (!isCsr && !bigpipe) {
      // not fetch when generate <head>
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
    let err: any = null
    const app = getApp({
      state,
      asyncData,
      layoutFetchData,
      combineAysncData,
      manifest,
      jsInject,
      cssInject,
      isCsr,
      inlineCssOrder,
      inlineJsOrder,
      rootId
    })
    if (!app.config.errorHandler) {
      app.config.errorHandler = e => { err = e }
    }
    app.use(router)
    app.use(store)
    app.use(pinia)

    const res = await appLocalStoreageWrapper.run({
      app
    }, async () => {
      if (stream) {
        const stream = renderToNodeStream(app)
        if (err) {
          throw new Error(err)
        }
        return stream
      } else {
        const teleportsContext: {
          teleports?: Record<string, string>
        } = {}
        const html = await renderToString(app, teleportsContext)
        if (err) {
          throw new Error(err)
        }
        return ({
          html,
          teleportsContext
        })
      }
    })
    return res
  }
  store.state.asyncGlobalData = asyncGlobalData
  const res = await localStorageWrapper.run({
    pinia,
    store,
    ctx
  }, fn)
  return res
}

export {
  serverRender,
  Routes
}
