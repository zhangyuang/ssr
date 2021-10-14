import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { IServerFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const { FeRoutes, App, layoutFetch, Layout, BASE_NAME } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ ?? false
  const router = createRouter()
  let path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  if (BASE_NAME) {
    path = normalizePath(path)
  }
  const store = createStore()
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, customeFooterScript, chunkName, parallelFetch, disableClientRender } = config
  const routeItem = findRoute<IServerFeRouteItem>(FeRoutes, path)
  const viteMode = process.env.BUILD_TOOL === 'vite'

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
  router.push(path)
  await router.isReady()

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      // 是否
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ store, router: router.currentRoute.value }, ctx) : Promise.resolve({}),
        fetch ? fetch({ store, router: router.currentRoute.value }, ctx) : Promise.resolve({})
      ])
    } else {
      if (layoutFetch) {
        layoutFetchData = await layoutFetch({ store, router: router.currentRoute.value }, ctx)
      }
      if (fetch) {
        fetchData = await fetch({ store, router: router.currentRoute.value }, ctx)
      }
    }
  }

  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
  const asyncData = {
    value: combineAysncData
  }

  const injectCss: Vue.VNode[] = []
  if (viteMode) {
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

  const injectScript = viteMode ? h('script', {
    type: 'module',
    src: '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'
  }) : jsOrder.map(js =>
    h('script', {
      src: manifest[js]
    })
  )

  const customeHeadScriptArr = customeHeadScript?.map((item) => h(
    'script',
    Object.assign({}, item.describe, {
      innerHTML: item.content
    })
  )
  ) ?? []

  if (disableClientRender) {
    customeHeadScriptArr.push(h('script', {
      innerHTML: 'window.__disableClientRender__ = true'
    }))
  }
  const state = Object.assign({}, store.state ?? {}, asyncData.value)

  const app = createSSRApp({
    render: function () {
      return h(
        Layout,
        { ctx, config, asyncData, fetchData: layoutFetchData },
        {
          remInitial: () => h('script', { innerHTML: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'" }),

          viteClient: viteMode ? () =>
            h('script', {
              type: 'module',
              src: '/@vite/client'
            }) : null,

          customeHeadScript: () => customeHeadScriptArr,
          customeFooterScript: () => customeFooterScript?.map((item) =>
            h(
              'script',
              Object.assign({}, item.describe, {
                innerHTML: item.content
              })
            )
          ),

          children: isCsr ? () => h('div', {
            id: 'app'
          }) : () => h(App, { ctx, config, asyncData, fetchData: combineAysncData }),

          initialData: !isCsr ? () => h('script', { innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${viteMode}` })
            : () => h('script', { innerHTML: `window.__USE_VITE__=${viteMode}` }),

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

export {
  serverRender
}
