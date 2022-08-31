import * as Vue from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk, getUserScriptVue, remInitial, setStore } from 'ssr-common-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import { serialize } from 'ssr-serialize-javascript'
import { Routes } from './create-router'
import { createRouter, createStore } from './create'
import { IFeRouteItem } from '../types'

const { FeRoutes, App, layoutFetch, Layout } = Routes

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<Vue.Component> => {
  const { mode, customeHeadScript, customeFooterScript, isDev, parallelFetch, prefix, isVite, clientPrefix } = config
  const router = createRouter()
  const store = createStore()
  setStore(store)
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

  let [layoutFetchData, fetchData] = [{}, {}]

  if (!isCsr) {
    router.push(url)
    const currentFetch = fetch ? (await fetch()).default : null
    const lF = layoutFetch ? layoutFetch({ store, router: router.currentRoute, ctx }, ctx) : Promise.resolve({})
    const CF = currentFetch ? currentFetch({ store, router: router.currentRoute, ctx }, ctx) : Promise.resolve({});
    [layoutFetchData, fetchData] = parallelFetch ? await Promise.all([lF, CF]) : [await lF, await CF]
  } else {
    logGreen(`Current path ${path} use csr render mode`)
  }

  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
  const state = Object.assign({}, store.state ?? {}, combineAysncData)
  // @ts-expect-error
  const app = new Vue({
    router,
    store,
    render: function (h: Vue.CreateElement) {
      const injectCss = (isVite && isDev) ? [h('script', {
        attrs: {
          type: 'module',
          src: '/@vite/client'
        }
      })] : dynamicCssOrder.map(css => manifest[css]).filter(Boolean).map(css => h('link', {
        attrs: {
          rel: 'stylesheet',
          href: css
        }
      }))
      const injectScript = (isVite && isDev) ? [h('script', {
        attrs: {
          type: 'module',
          src: '/node_modules/ssr-plugin-vue/esm/entry/client-entry.js'
        }
      })] : dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(js => h('script', {
        attrs: {
          src: js,
          type: isVite ? 'module' : 'text/javascript'
        }
      }))

      const customeHeadScriptArr: Vue.VNode[] = getUserScriptVue(customeHeadScript, ctx, h, 'vue')
      const customeFooterScriptArr: Vue.VNode[] = getUserScriptVue(customeFooterScript, ctx, h, 'vue')
      const initialData = isCsr ? h('script', {
        domProps: {
          innerHTML: `window.__USE_VITE__=${isVite}; window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}"` : ''}`
        }
      }) : h('script', {
        domProps: {
          innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ = ${serialize(state)};window.__USE_VITE__=${isVite}; window.prefix="${prefix}" ;${clientPrefix ? `window.clientPrefix="${clientPrefix}";` : ''}`
        }
      })
      const children = h('div', {
        attrs: {
          id: 'app'
        }
      }, [h(App, {
        props: { ctx, config, fetchData: combineAysncData, reactiveFetchData: { value: combineAysncData } }
      })])
      return h(
        Layout,
        {
          props: { ctx, config, asyncData: combineAysncData, fetchData: layoutFetchData, reactiveFetchData: { value: layoutFetchData } }
        },
        [
          h('template', {
            slot: 'remInitial'
          }, [
            h('script', {}, [
              remInitial
            ])
          ]),

          h('template', {
            slot: 'customeHeadScript'
          }, customeHeadScriptArr),
          h('template', {
            slot: 'customeFooterScript'
          }, customeFooterScriptArr),

          h('template', {
            slot: 'children'
          }, [
            children
          ]),

          h('template', {
            slot: 'initialData'
          }, [
            initialData
          ]),

          h('template', {
            slot: 'cssInject'
          }, injectCss),

          h('template', {
            slot: 'jsInject'
          }, injectScript),

          h('template', {
            slot: 'injectHeader'
          }, [
            customeHeadScriptArr,
            injectCss
          ]),

          h('template', {
            slot: 'content'
          }, [
            children,
            initialData,
            customeFooterScriptArr,
            injectScript
          ])
        ]
      )
    }
  })
  return app
}

export {
  serverRender
}
