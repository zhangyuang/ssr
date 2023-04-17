import { PassThrough } from 'stream'
import * as React from 'react'
import { createElement } from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk, reactRefreshFragment, localStorageWrapper, checkRoute } from 'ssr-common-utils'
import { ISSRContext, IConfig, ReactESMPreloadFeRouteItem, DynamicFC, StaticFC } from 'ssr-types'
import { serialize } from 'ssr-serialize-javascript'
import { STORE_CONTEXT as Context } from '_build/create-context'
import { Routes } from './create-router'

const { FeRoutes, layoutFetch, state, Layout } = Routes

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { mode, parallelFetch, prefix, isVite, isDev, clientPrefix, stream, rootId } = config
  const rawPath = ctx.request.path ?? ctx.request.url
  const path = normalizePath(rawPath, prefix)
  const routeItem = findRoute<ReactESMPreloadFeRouteItem>(FeRoutes, path)
  checkRoute({ routeItem, path })
  const { fetch, webpackChunkName, component } = routeItem

  const fn = async () => {
    const dynamicCssOrder = await getAsyncCssChunk(ctx, webpackChunkName, config)
    const dynamicJsOrder = await getAsyncJsChunk(ctx, webpackChunkName, config)
    const manifest = await getManifest(config)

    const injectCss = ((isVite && isDev) ? [
      <script src="/@vite/client" type="module" key="vite-client" />,
      <script key="vite-react-refresh" type="module" dangerouslySetInnerHTML={{
        __html: reactRefreshFragment
      }} />
    ] : dynamicCssOrder.map(css => manifest[css]).filter(Boolean).map(css => <link rel='stylesheet' key={css} href={css} />))
      .concat((isVite && isDev) ? [] : dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(js =>
        <link href={js} as="script" rel={isVite ? 'modulepreload' : 'preload'} key={js} />
      ))

    const injectScript = [
      ...(isVite ? [<script key="viteWindowInit" dangerouslySetInnerHTML={{
        __html: 'window.__USE_VITE__=true'
      }} />] : []),
      ...((isVite && isDev) ? [<script type="module" src='/node_modules/ssr-plugin-react/esm/entry/client-entry.js' key="vite-react-entry" />] : []),
      ...dynamicJsOrder.map(js => manifest[js]).filter(Boolean).map(item => <script key={item} src={item} type={isVite ? 'module' : 'text/javascript'} />)
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

    let [layoutFetchData, fetchData] = [{}, {}]

    if (!isCsr) {
      const currentFetch = fetch ? (await fetch()).default : null
      const lF = layoutFetch ? layoutFetch({ ctx }) : Promise.resolve({})
      const CF = currentFetch ? currentFetch({ ctx }) : Promise.resolve({});
      [layoutFetchData, fetchData] = parallelFetch ? await Promise.all([lF, CF]) : [await lF, await CF]
    }

    const combineData = isCsr ? null : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {})
    const ssrDevInfo = { manifest, rootId }
    const injectState = isCsr ? <script dangerouslySetInnerHTML={{ __html: `window.ssrDevInfo=${JSON.stringify(ssrDevInfo)};window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}";` : ''}` }} />
      : <script dangerouslySetInnerHTML={{
        __html: `window.ssrDevInfo=${JSON.stringify(ssrDevInfo)};window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(combineData)}; window.prefix="${prefix}";${clientPrefix ? `window.clientPrefix="${clientPrefix}";` : ''}`
      }} />
    // with jsx type error, use createElement here
    const ele = createElement(StaticRouter, {
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
    // for ctx.body will loose asynclocalstorage context, consume stream in advance like vue2/3
    return stream ? renderToNodeStream(ele).pipe(new PassThrough()) : renderToString(ele)
  }

  return await localStorageWrapper.run({
    context: Context
  }, fn)
}

export {
  serverRender,
  Routes
}
