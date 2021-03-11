import * as React from 'react'
import { useContext, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { FC } from 'ssr-types'

let routerChanged = false

const fetch = async (WrappedComponent: FC, dispatch: any, props: any) => {
  const asyncData = WrappedComponent.fetch ? await WrappedComponent.fetch(props) : {}
  await dispatch({
    type: 'updateContext',
    payload: asyncData
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
