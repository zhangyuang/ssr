import * as React from 'react'
import 'react-router'
import { useContext, useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { DynamicFC, StaticFC, Action, ReactESMFetch, ReactFetch } from 'ssr-types-react'
// @ts-expect-error
import { STORE_CONTEXT } from '_build/create-context'

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
function wrapComponent (WrappedComponent: DynamicFC|StaticFC) {
  return withRouter(props => {
    const [ready, setReady] = useState(WrappedComponent.name !== 'dynamicComponent')
    const { state, dispatch } = useContext(STORE_CONTEXT)

    useEffect(() => {
      didMount()
    }, [])

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        const { fetch, layoutFetch } = (WrappedComponent as DynamicFC)
        await fetchAndDispatch({ fetch, layoutFetch }, dispatch, props, state)
        if (WrappedComponent.name === 'dynamicComponent') {
          WrappedComponent = (await (WrappedComponent as DynamicFC)()).default
          WrappedComponent.fetch = fetch
          WrappedComponent.layoutFetch = layoutFetch
          setReady(true)
        }
      }
      hasRender = true
    }
    return (
      ready ? <WrappedComponent {...props}></WrappedComponent> : null
    )
  })
}

export {
  wrapComponent
}
