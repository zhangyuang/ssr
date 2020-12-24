import * as React from 'react'
import { useContext, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC } from 'ssr-types'

let _fetch: any = null
let routerChanged = false

const popStateFn = (e: PopStateEvent) => {
  // historyPop的时候需要调用fetch
  routerChanged = true
  // 使用popStateFn保存函数防止addEventListener重复注册,排除hashchange的情况
  if (!location.hash && _fetch) {
    _fetch()
  }
}
interface IState {
  asyncData: Object
}

function wrapComponent (WrappedComponent: FC): any {
  return withRouter((props) => {
    const { state, dispatch } = useContext(window.STORE_CONTEXT)
    if (!routerChanged) {
      routerChanged = !window.__USE_SSR__ || (props.history && props.history.action === 'PUSH')
    }
    window.addEventListener('popstate', popStateFn)
    useEffect(() => {
      didMount()
    }, [])
    const didMount = async () => {
      if (props?.history.action !== 'POP' || !window.__USE_SSR__) {
        await fetch()
      }
    }
    const fetch = async () => {
      // csr首次进入页面以及csr/ssr切换路由时才调用fetch
      const asyncData = WrappedComponent.fetch ? await WrappedComponent.fetch(props) : {}
      const data = Object.assign({}, routerChanged ? {} : state, asyncData)
      await dispatch({
        type: 'updateContext',
        payload: data
      })
    }
    _fetch = fetch
    return <WrappedComponent {...props}></WrappedComponent>
  })
}

export {
  wrapComponent
}
