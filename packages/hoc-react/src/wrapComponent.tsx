import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC, IFC, Action, IWindow } from 'ssr-types-react'

declare const window: IWindow

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

function wrapComponent (WrappedComponent: FC|IFC) {
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
        await fetch((WrappedComponent as FC), dispatch, props)
        if (WrappedComponent.name === 'dynamicComponent') {
          WrappedComponent = (await (WrappedComponent as FC)()).default
          setReady(true)
        }
      }
      if (!hasRender) {
        // ssr 场景首次渲染的情况下客户端无需获取数据
        hasRender = true
      }
    }
    return (
      // @ts-expect-error
      ready ? <WrappedComponent {...props}></WrappedComponent> : null
    )
  })
}

export {
  wrapComponent
}
