import * as React from 'react'
import { useContext, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC, Action } from 'ssr-types'

let routerChanged = false

const fetch = async (WrappedComponent: FC, dispatch: React.Dispatch<Action>, props: RouteComponentProps) => {
  const asyncLayoutData = WrappedComponent.layoutFetch ? await WrappedComponent.layoutFetch(props) : {}
  const asyncData = WrappedComponent.fetch ? await WrappedComponent.fetch(props) : {}
  const combineData = Object.assign({}, asyncLayoutData ?? {}, asyncData ?? {})

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
      if (routerChanged || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        await fetch(WrappedComponent, dispatch, props)
      }
      if (!routerChanged) {
        // routerChanged 为 true 代表已经进行过切换路由的操作
        routerChanged = true
      }
    }

    return <WrappedComponent {...props}></WrappedComponent>
  })
}

export {
  wrapComponent
}
