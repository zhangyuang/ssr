import * as React from 'react'
import { createElement } from 'react'
import { StaticRouter } from 'react-router-dom'
import { findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk, reactRefreshFragment } from 'ssr-server-utils'
import { ISSRContext, IConfig, ReactESMPreloadFeRouteItem, DynamicFC, StaticFC } from 'ssr-types-react'
import { setStoreContext } from 'ssr-common-utils'
import { serialize } from 'ssr-serialize-javascript'
import { STORE_CONTEXT as Context } from '_build/create-context'
import { Routes } from './create-router'

const { FeRoutes, layoutFetch, state, Layout } = Routes

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { mode, parallelFetch, prefix, isVite, isDev, clientPrefix } = config
  const path = normalizePath(ctx.request.path, prefix)
  const routeItem = findRoute<ReactESMPreloadFeRouteItem>(FeRoutes, path)
  setStoreContext(Context)

  if (!routeItem) {
    throw new Error(`
    With Path: ${path} search component failed
    If you create new folder or component file, please restart server by npm start
    `)
  }

  const { fetch, webpackChunkName, component } = routeItem
  const dynamicCssOrder = await getAsyncCssChunk(ctx, webpackChunkName, config)
  const dynamicJsOrder = await getAsyncJsChunk(ctx, webpackChunkName, config)
  const manifest = await getManifest(config)

  const injectCss = ((isVite && isDev) ? [
    <script src="/@vite/client" type="module" key="vite-client"/>,
    <script key="vite-react-refresh" type="module" dangerouslySetInnerHTML={{
      __html: reactRefreshFragment
    }} />
  ] : dynamicCssOrder.map(css => manifest[css]).filter(Boolean).map(css => <link rel='stylesheet' key={css} href={css} />))
    .concat((isVite && isDev) ? [] : dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(js =>
      <link href={js} as="script" rel={isVite ? 'modulepreload' : 'preload'} key={js}/>
    ))

  const injectScript = [
    ...(isVite ? [<script key="viteWindowInit" dangerouslySetInnerHTML={{
      __html: 'window.__USE_VITE__=true'
    }} />] : []),
    ...((isVite && isDev) ? [<script type="module" src='/node_modules/ssr-plugin-react/esm/entry/client-entry.js' key="vite-react-entry" />] : []),
    ...dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(item => <script key={item} src={item} type={isVite ? 'module' : 'text/javascript'}/>)
  ]
  const staticList = {
    injectCss,
    injectScript
  }

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)
  const Component = isCsr ? React.Fragment : (component.name === 'dynamicComponent' ? (await (component as DynamicFC)()).default : component as StaticFC)

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
  const injectState = isCsr ? <script dangerouslySetInnerHTML={{ __html: `window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}";` : ''}` }} /> : <script dangerouslySetInnerHTML={{
    __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(combineData)}; window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}";` : ''}`
  }} />
  // with jsx type error, use createElement here
  return createElement(StaticRouter, {
    location: ctx.request.url,
    basename: prefix === '/' ? undefined : prefix
  }, createElement(Context.Provider, {
    value: {
      state: combineData
    }
  }, createElement(Layout, {
    ctx: ctx,
    config: config,
    staticList: staticList,
    injectState: injectState
  }, createElement(Component, null))))
}

export {
  serverRender
}
