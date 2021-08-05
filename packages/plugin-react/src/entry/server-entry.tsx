import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IGlobal, IConfig, ReactRoutesType, ReactServerESMFeRouteItem } from 'ssr-types-react'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { serverContext } from './create-context'
// @ts-expect-error
import Layout from '@/components/layout/index.tsx'

const { FeRoutes, layoutFetch, BASE_NAME, state } = Routes as ReactRoutesType

declare const global: IGlobal

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  const { cssOrder, jsOrder, dynamic, mode, chunkName, parallelFetch } = config
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  let path = ctx.request.path // 这里取 pathname 不能够包含 queyString
  if (BASE_NAME) {
    path = normalizePath(path)
  }
  const { window } = global
  const routeItem = findRoute<ReactServerESMFeRouteItem>(FeRoutes, path)
  const ViteMode = process.env.BUILD_TOOL === 'vite'

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `)
  }

  let dynamicCssOrder = cssOrder

  if (dynamic && !ViteMode) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    dynamicCssOrder = await addAsyncChunk(dynamicCssOrder, routeItem.webpackChunkName)
  }
  const manifest = ViteMode ? {} : await getManifest()

  const injectCss: JSX.Element[] = []

  if (ViteMode) {
    injectCss.push(<script src="/@vite/client" type="module" key="vite-client"/>)
    injectCss.push(<script key="vite-react-refresh" type="module" dangerouslySetInnerHTML={{
      __html: ` import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true`
    }} />)
    injectCss.push(<link rel='stylesheet' href={`/server/static/css/${chunkName}.css`} key="vite-head-css"/>)
  } else {
    dynamicCssOrder.forEach(css => {
      if (manifest[css]) {
        const item = manifest[css]
        injectCss.push(<link rel='stylesheet' key={item} href={item} />)
      }
    })
  }

  const injectScript = ViteMode ? [
    <script key="viteWindowInit" dangerouslySetInnerHTML={{
      __html: 'window.__USE_VITE__=true'
    }} />,
    <script type="module" src='/node_modules/ssr-plugin-react/esm/entry/client-entry.js' key="vite-react-entry" />
  ]
    : jsOrder.map(js => manifest[js]).map(item => <script key={item} src={item} />)

  const staticList = {
    injectCss,
    injectScript
  }

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)
  const { component, fetch } = routeItem
  const Component = component

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }
  let layoutFetchData = {}
  let fetchData = {}
  if (!isCsr) {
    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch(ctx) : Promise.resolve({}),
        fetch ? fetch(ctx) : Promise.resolve({})
      ])
    } else {
      if (layoutFetch) {
        layoutFetchData = await layoutFetch(ctx)
      }
      if (fetch) {
        fetchData = await fetch(ctx)
      }
    }
  }
  const combineData = isCsr ? null : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {})

  const injectState = isCsr ? null : <script dangerouslySetInnerHTML={{
    __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(combineData)}`
  }} />

  const Context = serverContext(combineData) // 服务端需要每个请求创建新的独立的 context
  window.STORE_CONTEXT = Context // 为每一个新的请求都创建一遍 context 并且覆盖 window 上的属性，使得无需通过props层层传递读取

  return (
    <StaticRouter>
      <Context.Provider value={{ state: combineData }}>
        <Layout ctx={ctx} config={config} staticList={staticList} injectState={injectState}>
          {isCsr ? <></> : <Component />}
        </Layout>
      </Context.Provider>
    </StaticRouter>
  )
}

export default serverRender
