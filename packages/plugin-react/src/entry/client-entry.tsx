import type * as ReactDOM18Type from 'react-dom18/client'
import type * as ReactDOMType from 'react-dom'
import type { LayoutProps } from 'ssr-types'
import { createElement, version } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent, isMicro, setStoreContext, setStore } from 'ssr-common-utils'
import { wrapComponent } from 'ssr-hoc-react'
import * as foo from 'valtio'
console.log(foo)
import { ssrCreateContext, Routes, createStore } from './create'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App } = Routes

const isReact18 = version.startsWith('18')
const clientRender = async (): Promise<void> => {
	const IApp =
		App ??
		function (props: LayoutProps) {
			return props.children!
		}
	const context = ssrCreateContext() as any
	setStoreContext(context)
	const store = createStore(window.__VALTIO_DATA__)
	setStore(store ?? {})
	const baseName = isMicro() ? window.clientPrefix : window.prefix
	const routes = await preloadComponent(FeRoutes, baseName)
	const container = document.querySelector(window.ssrDevInfo.rootId ?? '#app')!
	const ele = createElement(
		BrowserRouter,
		{
			basename: baseName
		},
		createElement(AppContext, {
			context,
			children: createElement(
				Switch,
				null,
				createElement(
					IApp as any,
					null,
					createElement(
						Switch,
						null,
						routes.map((item) => {
							const { fetch, component, path } = item
							component.fetch = fetch
							component.layoutFetch = layoutFetch
							const WrappedComponent = wrapComponent(component)
							return createElement(Route, {
								exact: true,
								key: path,
								path: path,
								render: (props) =>
									createElement(WrappedComponent, {
										...props,
										key: props.history.location.key
									})
							})
						})
					)
				)
			)
		})
	)
	if (isReact18) {
		//@ts-expect-error
		const ReactDOM = await import('react-dom/client')
		if (window.__USE_SSR__) {
			;(ReactDOM as typeof ReactDOM18Type).hydrateRoot(container, ele)
		} else {
			const root = (ReactDOM as typeof ReactDOM18Type).createRoot(container)
			root.render(ele)
		}
	} else {
		const ReactDOM = await import('react-dom')
		;(ReactDOM as typeof ReactDOMType)[window.__USE_SSR__ ? 'hydrate' : 'render'](ele, container)
	}

	if (!window.__USE_VITE__) {
		;(module as any)?.hot?.accept?.()
	}
}

clientRender()

export { clientRender }
