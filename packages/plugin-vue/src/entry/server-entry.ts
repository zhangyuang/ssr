import * as Vue from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import { sync } from 'vuex-router-sync'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { IServerFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const { FeRoutes, App, layoutFetch, Layout, PrefixRouterBase } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<Vue.Component> => {
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, customeFooterScript, chunkName, parallelFetch, disableClientRender, prefix } = config
  const router = createRouter()
  const store = createStore()
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  const viteMode = process.env.BUILD_TOOL === 'vite'
  sync(store, router)
  let { path, url } = ctx.request

  if (base) {
    path = normalizePath(path, base)
    url = normalizePath(url, base)
  }

  const routeItem = findRoute<IServerFeRouteItem>(FeRoutes, path)

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `)
  }

  let dynamicCssOrder = cssOrder
  if (dynamic && !viteMode) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    dynamicCssOrder = await addAsyncChunk(dynamicCssOrder, routeItem.webpackChunkName)
  }

  const manifest = viteMode ? {} : await getManifest()

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    const { fetch } = routeItem
    router.push(url)

    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ store, router: router.currentRoute }, ctx) : Promise.resolve({}),
        fetch ? fetch({ store, router: router.currentRoute }, ctx) : Promise.resolve({})
      ])
    } else {
      if (layoutFetch) {
        layoutFetchData = await layoutFetch({ store, router: router.currentRoute }, ctx)
      }
      if (fetch) {
        fetchData = await fetch({ store, router: router.currentRoute }, ctx)
      }
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
      if (viteMode) {
        injectCss.push(
          h('link', {
            attrs: {
              rel: 'stylesheet',
              href: `/server/static/css/${chunkName}.css`
            }
          })
        )
      } else {
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
      }

      const injectScript: Vue.VNode[] = viteMode ? [h('script', {
        attrs: {
          type: 'module',
          src: '/node_modules/ssr-plugin-vue/esm/entry/client-entry.js'
        }
      })] : jsOrder.map(js => h('script', {
        attrs: {
          src: manifest[js]
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
          viteMode && h('template', {
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
                innerHTML: `window.__USE_VITE__=${viteMode}`
              }
            }) : h('script', {
              domProps: {
                innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${viteMode}`
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
