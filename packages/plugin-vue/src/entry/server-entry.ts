import * as Vue from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import { sync } from 'vuex-router-sync'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { IServerFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const { FeRoutes, App, layoutFetch, Layout, BASE_NAME } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<Vue.Component> => {
  const router = createRouter()
  const store = createStore()
  const viteMode = process.env.BUILD_TOOL === 'vite'
  sync(store, router)

  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, customeFooterScript, chunkName, parallelFetch } = config
  let path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  if (BASE_NAME) {
    path = normalizePath(path)
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

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }
  const { fetch } = routeItem
  // 根据 path 匹配 router-view 展示的组件
  router.push(path)

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      // 是否
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
          }, customeHeadScript?.map(item => h('script', Object.assign({}, item.describe, {
            domProps: {
              innerHTML: item.content
            }
          })))),
          h('template', {
            slot: 'customeFooterScript'
          }, customeFooterScript?.map(item => h('script', Object.assign({}, item.describe, {
            domProps: {
              innerHTML: item.content
            }
          })))),

          h('template', {
            slot: 'children'
          }, [
            isCsr ? h('div', {
              // csr 只需渲染一个空的 <div id="app"> 不需要渲染具体的组件也就是 router-view
              attrs: {
                id: 'app'
              }
            }) : h(App, {
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

export default serverRender
