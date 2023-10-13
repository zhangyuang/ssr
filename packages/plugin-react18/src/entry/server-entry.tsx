import { PassThrough } from 'stream'
import * as React from 'react'
import { createElement } from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString, renderToPipeableStream } from 'react-dom/server'
import { findRoute, getManifest, logGreen, normalizePath, getAsyncCssChunk, getAsyncJsChunk, reactRefreshFragment, localStorageWrapper, checkRoute, splitPageInfo, useStore } from 'ssr-common-utils'
import { ISSRContext, IConfig, ReactESMPreloadFeRouteItem, DynamicFC, StaticFC } from 'ssr-types'
import { serialize } from 'ssr-serialize-javascript'
import { STORE_CONTEXT as Context } from '_build/create-context'
import { Routes } from './create-router'

const { FeRoutes, layoutFetch, state, Layout, store } = Routes

const serverRender = async (ctx: ISSRContext, config: IConfig) => {
  const { mode, parallelFetch, prefix, isVite, isDev, clientPrefix, stream, onError, onReady, rootId, hashRouter } = config
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
      ...((isVite && isDev) ? [<script type="module" src='/node_modules/ssr-plugin-react18/esm/entry/client-entry.js' key="vite-react-entry" />] : []),
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
    const ssrDevInfo = { manifest: isDev ? manifest : '', rootId }
    const combineData = isCsr ? null : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {})
    const innerHTML = splitPageInfo({
      'window.__USE_SSR__': !isCsr,
      'window.__INITIAL_DATA__': isCsr ? {} : serialize(combineData),
      'window.__USE_VITE__': isVite,
      'window.prefix': `"${prefix}"`,
      'window.clientPrefix': `"${clientPrefix ?? ''}"`,
      'window.ssrDevInfo': JSON.stringify(ssrDevInfo),
      'window.hashRouter': Boolean(hashRouter),
      'window.__VALTIO_DATA__': isCsr ? {} : serialize(useStore())
    })
    const injectState = <script dangerouslySetInnerHTML={{ __html: innerHTML }} />
    // with jsx type error, use createElement here
    // @ts-expect-error
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
    return stream ? renderToPipeableStream(ele, {
      onAllReady: onReady,
      onError
    }).pipe(new PassThrough()) : renderToString(ele)
  }
  return await localStorageWrapper.run({
    context: Context,
    ctx,
    store
  }, fn)
}

export {
  serverRender,
  Routes
}
