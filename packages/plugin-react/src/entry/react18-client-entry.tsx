import type { hydrateRoot as HydrateRoot, createRoot as CreateRoot } from 'react-dom18/client'
import type { LayoutProps } from 'ssr-types'

//@ts-ignore
import { hydrateRoot, createRoot } from 'react-dom/client'
import { createElement } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent, isMicro, setStoreContext, setStore } from 'ssr-common-utils'
import { wrapComponent } from 'ssr-hoc-react'
import { ssrCreateContext, Routes, createStore } from './create'
import { AppContext } from './context'

const { FeRoutes, layoutFetch, App } = Routes

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
		//@ts-ignore
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
	if (window.__USE_SSR__) {
		;(hydrateRoot as typeof HydrateRoot)(container, ele)
	} else {
		const root = (createRoot as typeof CreateRoot)(container)
		root.render(ele)
	}

	if (!window.__USE_VITE__) {
		;(module as any)?.hot?.accept?.()
	}
}

clientRender()

export { clientRender }
