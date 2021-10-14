import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { DynamicFC, StaticFC, Action, IWindow, ReactESMFetch, ReactFetch } from 'ssr-types-react'

declare const window: IWindow

let hasRender = false

interface fetchType {
  fetch?: ReactESMFetch
  layoutFetch?: ReactFetch
}

const fetchAndDispatch = async ({ fetch, layoutFetch }: fetchType, dispatch: React.Dispatch<Action>, props: RouteComponentProps) => {
  let asyncLayoutData = {}
  let asyncData = {}
  if (layoutFetch) {
    asyncLayoutData = await layoutFetch(props)
  }
  if (fetch) {
    const fetchFn = await fetch()
    asyncData = await fetchFn.default(props)
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
    const { dispatch } = useContext(window.STORE_CONTEXT)

    useEffect(() => {
      didMount()
    }, [])

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        const { fetch, layoutFetch } = (WrappedComponent as DynamicFC)
        await fetchAndDispatch({ fetch, layoutFetch }, dispatch, props)
        if (WrappedComponent.name === 'dynamicComponent') {
          WrappedComponent = (await (WrappedComponent as DynamicFC)()).default
          WrappedComponent.fetch = fetch
          WrappedComponent.layoutFetch = layoutFetch
          setReady(true)
        }
      }
      if (!hasRender) {
        // ssr 场景首次渲染的情况下客户端无需获取数据
        hasRender = true
      }
    }
    return (
      ready ? <WrappedComponent {...props}></WrappedComponent> : null
    )
  })
}

export {
  wrapComponent
}
