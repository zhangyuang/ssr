import * as Vue from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk, getUserScriptVue, remInitial } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import { serialize } from 'ssr-serialize-javascript'
import { Routes } from './create-router'
import { IFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const { FeRoutes, App, layoutFetch, Layout, PrefixRouterBase } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<Vue.Component> => {
  const { mode, customeHeadScript, customeFooterScript, isDev, parallelFetch, prefix, isVite, clientPrefix } = config
  const router = createRouter()
  const store = createStore()
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  let { path, url } = ctx.request

  if (base) {
    path = normalizePath(path, base)
    url = normalizePath(url, base)
  }

  const routeItem = findRoute<IFeRouteItem>(FeRoutes, path)

  if (!routeItem) {
    throw new Error(`
    With Path: ${path} search component failed
    If you create new folder or component file, please restart server by npm start
    `)
  }
  const { fetch, webpackChunkName } = routeItem
  const dynamicCssOrder = await getAsyncCssChunk(ctx, webpackChunkName)
  const dynamicJsOrder = await getAsyncJsChunk(ctx)
  const manifest = await getManifest(config)

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    const currentFetch = fetch ? (await fetch()).default : null
    router.push(url)

    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ store, router: router.currentRoute }, ctx) : Promise.resolve({}),
        currentFetch ? currentFetch({ store, router: router.currentRoute }, ctx) : Promise.resolve({})
      ])
    } else {
      layoutFetchData = layoutFetch ? await layoutFetch({ store, router: router.currentRoute }, ctx) : {}
      fetchData = currentFetch ? await currentFetch({ store, router: router.currentRoute }, ctx) : {}
    }
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
      const injectCss: Vue.VNode[] = []
      dynamicCssOrder.forEach(css => {
        if (manifest[css]) {
          injectCss.push(
            h('link', {
              attrs: {
                rel: 'stylesheet',
                href: manifest[css]
              }
            })
          )
        }
      })

      const injectScript: Vue.VNode[] = (isVite && isDev) ? [h('script', {
        attrs: {
          type: 'module',
          src: '/node_modules/ssr-plugin-vue/esm/entry/client-entry.js'
        }
      })] : dynamicJsOrder.map(js => h('script', {
        attrs: {
          src: manifest[js],
          type: isVite ? 'module' : ''
        }
      }))
      const viteClient = h('script', {
        attrs: {
          type: 'module',
          src: '/@vite/client'
        }
      })
      const customeHeadScriptArr: Vue.VNode[] = getUserScriptVue(customeHeadScript, ctx, h, 'vue')
      const customeFooterScriptArr: Vue.VNode[] = getUserScriptVue(customeFooterScript, ctx, h, 'vue')

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
          (isVite && isDev) && h('template', {
            slot: 'viteClient'
          }, [viteClient]),

          h('template', {
            slot: 'customeHeadScript'
          }, customeHeadScriptArr),
          h('template', {
            slot: 'customeFooterScript'
          }, customeFooterScriptArr),

          h('template', {
            slot: 'children'
          }, [
            h(App, {
              props: { ctx, config, fetchData: combineAysncData, reactiveFetchData: { value: combineAysncData } }
            })
          ]),

          h('template', {
            slot: 'initialData'
          }, [
            isCsr ? h('script', {
              domProps: {
                innerHTML: `window.__USE_VITE__=${isVite}`
              }
            }) : h('script', {
              domProps: {
                innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${isVite};  ${base && `window.prefix="${base}";${clientPrefix && `window.clientPrefix="${clientPrefix}"`}`}`
              }
            })
          ]),

          h('template', {
            slot: 'cssInject'
          }, injectCss),

          h('template', {
            slot: 'jsInject'
          }, injectScript)
        ]
      )
    }
  })
  return app
}

export {
  serverRender
}
