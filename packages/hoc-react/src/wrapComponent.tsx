import type { DynamicFC, StaticFC, Action, ReactESMFetch, ReactFetch } from 'ssr-types'
import * as React from 'react'
import { useContext, useEffect, useState, createElement } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import { useStoreContext } from 'ssr-common-utils'

let hasRender = false

interface fetchType {
	fetch?: ReactESMFetch
	layoutFetch?: ReactFetch
}

const fetchAndDispatch = async ({ fetch, layoutFetch }: fetchType, dispatch: React.Dispatch<Action>, routerProps: RouteComponentProps, state: any) => {
	let asyncLayoutData = {}
	let asyncData = {}
	if (layoutFetch) {
		asyncLayoutData = await layoutFetch({ routerProps, state })
	}
	if (fetch) {
		const fetchFn = await fetch()
		asyncData = await fetchFn.default({ routerProps, state })
	}

	const combineData = Object.assign({}, asyncLayoutData, asyncData)

	await dispatch({
		type: 'updateContext',
		payload: combineData
	})
}
function wrapComponent(WrappedComponent: DynamicFC | StaticFC) {
	return (props: any) => {
		const [ready, setReady] = useState(WrappedComponent.name !== 'dynamicComponent')
		const { state, dispatch } = useContext<any>(useStoreContext() as any)

		useEffect(() => {
			didMount()
		}, [])

		const didMount = async () => {
			if (hasRender || !window.__USE_SSR__) {
				const { fetch, layoutFetch } = WrappedComponent as DynamicFC
				await fetchAndDispatch({ fetch, layoutFetch }, dispatch!, props, state)
				if (WrappedComponent.name === 'dynamicComponent') {
					WrappedComponent = (await (WrappedComponent as DynamicFC)()).default
					WrappedComponent.fetch = fetch
					WrappedComponent.layoutFetch = layoutFetch
					setReady(true)
				}
			}
			hasRender = true
		}
		return ready ? createElement(WrappedComponent, { ...props }) : null
	}
}

export { wrapComponent }
