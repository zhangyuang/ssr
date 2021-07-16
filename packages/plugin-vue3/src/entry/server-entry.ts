import { promises } from 'fs'
import { resolve } from 'path'
import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, getCwd } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from 'ssr-temporary-routes'
import { IServerFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const { FeRoutes, App, layoutFetch, Layout, BASE_NAME } = Routes as RoutesType
const cwd = getCwd()

const readAsyncChunk = async () => {
  const str = await (await promises.readFile(resolve(cwd, './build/asyncChunkMap.json'))).toString()
  return JSON.parse(str)
}

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ ?? false
  const router = createRouter()
  let path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  if (BASE_NAME) {
    path = normalizePath(path)
  }
  const store = createStore()
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, chunkName } = config
  const routeItem = findRoute<IServerFeRouteItem>(FeRoutes, path)
  const ViteMode = process.env.BUILD_TOOL === 'vite'

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `)
  }

  let dynamicCssOrder = cssOrder
  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    const asyncChunkMap = await readAsyncChunk()
    for (const key in asyncChunkMap) {
      if (asyncChunkMap[key].indexOf(routeItem.webpackChunkName) !== -1) {
        dynamicCssOrder = dynamicCssOrder.concat(`${key}.css`)
      }
    }
  }

  const manifest = ViteMode ? {} : await getManifest()
  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }

  const { fetch } = routeItem
  router.push(path)
  await router.isReady()

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    // csr 下不需要服务端获取数据
    if (layoutFetch) {
      layoutFetchData = await layoutFetch({ store, router: router.currentRoute.value }, ctx)
    }
    if (fetch) {
      fetchData = await fetch({ store, router: router.currentRoute.value }, ctx)
    }
  }

  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
  const asyncData = {
    value: combineAysncData
  }

  const injectCss: Vue.VNode[] = []
  if (ViteMode) {
    injectCss.push(
      h('link', {
        rel: 'stylesheet',
        href: `/server/static/css/${chunkName}.css`
      })
    )
  } else {
    dynamicCssOrder.forEach(css => {
      if (manifest[css]) {
        injectCss.push(
          h('link', {
            rel: 'stylesheet',
            href: manifest[css]
          })
        )
      }
    })
  }

  const injectScript = ViteMode ? h('script', {
    type: 'module',
    src: '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'
  }) : jsOrder.map(js =>
    h('script', {
      src: manifest[js]
    })
  )
  const state = Object.assign({}, store.state ?? {}, asyncData.value)

  const app = createSSRApp({
    render: function () {
      return h(
        Layout,
        { ctx, config, asyncData, fetchData: layoutFetchData },
        {
          remInitial: () => h('script', { innerHTML: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'" }),

          viteClient: ViteMode ? () =>
            h('script', {
              type: 'module',
              src: '/@vite/client'
            }) : null,

          customeHeadScript: () => customeHeadScript?.map((item) =>
            h(
              'script',
              Object.assign({}, item.describe, {
                innerHTML: item.content
              })
            )
          ),

          children: isCsr ? () => h('div', {
            id: 'app'
          }) : () => h(App, { asyncData, fetchData: combineAysncData }),

          initialData: !isCsr ? () => h('script', { innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${ViteMode}` })
            : () => h('script', { innerHTML: `window.__USE_VITE__=${ViteMode}` }),

          cssInject: () => injectCss,

          jsInject: () => injectScript
        }
      )
    }
  })

  app.use(router)
  app.use(store)
  await router.isReady()

  window.__VUE_APP__ = app
  return app
}

export default serverRender
