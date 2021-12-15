import * as React from 'react'
import { StaticRouter } from 'react-router-dom'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from 'ssr-server-utils'
import { ISSRContext, IConfig, ReactRoutesType, ReactESMFeRouteItem } from 'ssr-types-react'
//@ts-expect-error
import * as serializeWrap from 'serialize-javascript'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
// @ts-expect-error
import { STORE_CONTEXT as Context } from '_build/create-context'
// @ts-expect-error
import Layout from '@/components/layout/index.tsx'

const { FeRoutes, layoutFetch, PrefixRouterBase, state } = Routes as ReactRoutesType
const serialize = serializeWrap.default || serializeWrap

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  const { cssOrder, jsOrder, dynamic, mode, parallelFetch, disableClientRender, prefix, isVite, isDev } = config
  let path = ctx.request.path // 这里取 pathname 不能够包含 queryString
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  if (base) {
    path = normalizePath(path, base)
  }
  const routeItem = findRoute<ReactESMFeRouteItem>(FeRoutes, path)

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
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

  const injectCss: JSX.Element[] = []

  if (isVite && isDev) {
    injectCss.push(<script src="/@vite/client" type="module" key="vite-client"/>)
    injectCss.push(<script key="vite-react-refresh" type="module" dangerouslySetInnerHTML={{
      __html: ` import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true`
    }} />)
  } else {
    dynamicCssOrder.forEach(css => {
      if (manifest[css]) {
        const item = manifest[css]
        injectCss.push(<link rel='stylesheet' key={item} href={item} />)
      }
    })
  }

  if (disableClientRender) {
    injectCss.push(<script key="disableClientRender" dangerouslySetInnerHTML={{
      __html: 'window.__disableClientRender__ = true'
    }}/>)
  }

  const injectScript = [
    isVite && <script key="viteWindowInit" dangerouslySetInnerHTML={{
      __html: 'window.__USE_VITE__=true'
    }} />,
    (isVite && isDev) && <script type="module" src='/node_modules/ssr-plugin-react/esm/entry/client-entry.js' key="vite-react-entry" />,
    ...jsOrder.map(js => manifest[js]).map(item => item && <script key={item} src={item} type={isVite ? 'module' : ''}/>)
  ]
  const staticList = {
    injectCss,
    injectScript
  }

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)
  const { component, fetch } = routeItem
  const Component = isCsr ? React.Fragment : (await component()).default
  async function foo () {
    // @ts-expect-error
    return await import('@/pages/index/render.tsx')
  }
  async function bar () {
    // @ts-expect-error
    return await import('@/pages/test.tsx')
  }
  console.log('xxx', await foo(), await bar())
  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }
  let layoutFetchData = {}
  let fetchData = {}
  if (!isCsr) {
    const currentFetch = fetch ? (await fetch()).default : null

    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ ctx }) : Promise.resolve({}),
        currentFetch ? currentFetch({ ctx }) : Promise.resolve({})
      ])
    } else {
      layoutFetchData = layoutFetch ? await layoutFetch({ ctx }) : {}
      fetchData = currentFetch ? await currentFetch({ ctx }) : {}
    }
  }
  const combineData = isCsr ? null : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {})

  const injectState = isCsr ? null : <script dangerouslySetInnerHTML={{
    __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(combineData)}`
  }} />

  return (
    <StaticRouter location={ctx.request.url}>
      <Context.Provider value={{ state: combineData }}>
        <Layout ctx={ctx} config={config} staticList={staticList} injectState={injectState}>
          <Component />
        </Layout>
      </Context.Provider>
    </StaticRouter>
  )
}

export {
  serverRender
}
