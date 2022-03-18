import * as Vue from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import { sync } from 'vuex-router-sync'
import { Routes } from './create-router'
import { IFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const serialize = require('serialize-javascript')
const { FeRoutes, App, layoutFetch, Layout, PrefixRouterBase } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<Vue.Component> => {
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, customeFooterScript, isDev, parallelFetch, disableClientRender, prefix, isVite } = config
  const router = createRouter()
  const store = createStore()
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  sync(store, router)
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

  let dynamicCssOrder = cssOrder
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    if (!isVite) {
      dynamicCssOrder = await addAsyncChunk(dynamicCssOrder, routeItem.webpackChunkName)
    }
  }
  const manifest = await getManifest(config)

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    const { fetch } = routeItem
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
      })] : jsOrder.map(js => h('script', {
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
      const customeHeadScriptArr = customeHeadScript ? (Array.isArray(customeHeadScript) ? customeHeadScript : customeHeadScript(ctx))?.map(item => h('script', Object.assign({}, item.describe, {
        domProps: {
          innerHTML: item.content
        }
      }))) : []

      if (disableClientRender) {
        customeHeadScriptArr.push(h('script', {
          domProps: {
            innerHTML: 'window.__disableClientRender__ = true'
          }
        }))
      }

      const customeFooterScriptArr = customeFooterScript ? (Array.isArray(customeFooterScript) ? customeFooterScript : customeFooterScript(ctx))?.map(item => h('script', Object.assign({}, item.describe, {
        domProps: {
          innerHTML: item.content
        }
      }))) : []

      return h(
        Layout,
        {
          props: { ctx, config, asyncData: combineAysncData, fetchData: layoutFetchData }
        },
        [
          h('template', {
            slot: 'remInitial'
          }, [
            h('script', {}, [
              "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'"
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
              props: { ctx, config, fetchData: combineAysncData }
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
                innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${isVite};  ${base && `window.prefix="${base}"`}`
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
