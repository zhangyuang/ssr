import * as Vue from 'vue'
import { h, createSSRApp } from 'vue'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IConfig } from 'ssr-types'

// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { IFeRouteItem, RoutesType } from './interface'
import { createRouter, createStore } from './create'

const serialize = require('serialize-javascript')
const { FeRoutes, App, layoutFetch, Layout, PrefixRouterBase } = Routes as RoutesType

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { cssOrder, jsOrder, dynamic, mode, customeHeadScript, customeFooterScript, chunkName, parallelFetch, disableClientRender, prefix } = config
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ ?? false

  const store = createStore()
  const router = createRouter()
  const isVite = process.env['BUILD_TOOL'] === 'vite'
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  let { path, url } = ctx.request

  if (base) {
    path = normalizePath(path, base)
    url = normalizePath(url, base)
  }

  const routeItem = findRoute<IFeRouteItem>(FeRoutes, path)

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `)
  }

  let dynamicCssOrder = cssOrder
  if (dynamic && !isVite) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    dynamicCssOrder = await addAsyncChunk(dynamicCssOrder, routeItem.webpackChunkName)
  }
  const manifest = isVite ? {} : await getManifest()
  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)

  let layoutFetchData = {}
  let fetchData = {}

  if (!isCsr) {
    router.push(url)
    await router.isReady()
    const { fetch } = routeItem
    const currentFetch = fetch ? (await fetch()).default : null
    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ store, router: router.currentRoute.value }, ctx) : Promise.resolve({}),
        currentFetch ? currentFetch({ store, router: router.currentRoute.value }, ctx) : Promise.resolve({})
      ])
    } else {
      layoutFetchData = layoutFetch ? await layoutFetch({ store, router: router.currentRoute.value }, ctx) : {}
      fetchData = currentFetch ? await currentFetch({ store, router: router.currentRoute.value }, ctx) : {}
    }
  } else {
    logGreen(`Current path ${path} use csr render mode`)
  }
  const combineAysncData = Object.assign({}, layoutFetchData ?? {}, fetchData ?? {})
  const asyncData = {
    value: combineAysncData
  }

  const injectCss: Vue.VNode[] = []
  if (isVite) {
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

  const injectScript = isVite ? h('script', {
    type: 'module',
    src: '/node_modules/ssr-plugin-vue3/esm/entry/client-entry.js'
  }) : jsOrder.map(js =>
    h('script', {
      src: manifest[js]
    })
  )

  const customeHeadScriptArr = customeHeadScript ? (Array.isArray(customeHeadScript) ? customeHeadScript : customeHeadScript(ctx))?.map((item) => h(
    'script',
    Object.assign({}, item.describe, {
      innerHTML: item.content
    })
  )) : []

  if (disableClientRender) {
    customeHeadScriptArr.push(h('script', {
      innerHTML: 'window.__disableClientRender__ = true'
    }))
  }
  const customeFooterScriptArr = customeFooterScript ? (Array.isArray(customeFooterScript) ? customeFooterScript : customeFooterScript(ctx))?.map((item) => h(
    'script',
    Object.assign({}, item.describe, {
      innerHTML: item.content
    })
  )) : []

  const state = Object.assign({}, store.state ?? {}, asyncData.value)

  const app = createSSRApp({
    render: () => h(Layout,
      { ctx, config, asyncData, fetchData: layoutFetchData },
      {
        remInitial: () => h('script', { innerHTML: "var w = document.documentElement.clientWidth / 3.75;document.getElementsByTagName('html')[0].style['font-size'] = w + 'px'" }),

        viteClient: isVite ? () =>
          h('script', {
            type: 'module',
            src: '/@vite/client'
          }) : null,

        customeHeadScript: () => customeHeadScriptArr,

        customeFooterScript: () => customeFooterScriptArr,

        children: () => h(App, { ctx, config, asyncData, fetchData: combineAysncData }),

        initialData: !isCsr ? () => h('script', { innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(state)};window.__USE_VITE__=${isVite}` })
          : () => h('script', { innerHTML: `window.__USE_VITE__=${isVite}` }),

        cssInject: () => injectCss,

        jsInject: () => injectScript
      }
    )
  })

  app.use(router)
  app.use(store)

  return app
}

export {
  serverRender
}
