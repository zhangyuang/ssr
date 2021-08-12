import * as React from 'react'
import { useContext, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC, Action } from 'ssr-types-react'

let hasRender = false

const fetch = async (WrappedComponent: FC, dispatch: React.Dispatch<Action>, props: RouteComponentProps) => {
  let asyncLayoutData = {}
  let asyncData = {}
  if (WrappedComponent.layoutFetch) {
    asyncLayoutData = await WrappedComponent.layoutFetch(props)
  }
  if (WrappedComponent.fetch) {
    const fetchFn = await WrappedComponent.fetch()
    asyncData = await fetchFn.default(props)
  }

  const combineData = Object.assign({}, asyncLayoutData, asyncData)

  await dispatch({
    type: 'updateContext',
    payload: combineData
  })
}

function wrapComponent (WrappedComponent: FC) {
  return withRouter(props => {
    const { dispatch } = useContext(window.STORE_CONTEXT)

    useEffect(() => {
      didMount()
    }, [])

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        await fetch(WrappedComponent, dispatch, props)
      }
      if (!hasRender) {
        // ssr 场景首次渲染的情况下客户端无需获取数据
        hasRender = true
      }
    }

    return <WrappedComponent {...props}></WrappedComponent>
  })
}

export {
  wrapComponent
}
