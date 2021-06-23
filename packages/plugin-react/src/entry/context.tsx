import * as React from 'react'
import { useReducer } from 'react'
import { IProps, Action, IWindow } from 'ssr-types-react'
import { clientContext as Context } from './create-context'

const isDev = process.env.NODE_ENV !== 'production'

// 客户端的 context  只需要创建一次，在页面整个生命周期内共享
declare const window: IWindow

window.STORE_CONTEXT = Context

function reducer (state: any, action: Action) {
  switch (action.type) {
    case 'updateContext':
      if (isDev) {
        console.log('[SSR:updateContext]: dispatch updateContext with action')
        console.log(action)
      }
      return { ...state, ...action.payload }
    default:
      throw new Error(`Action type ${action.type} is incorrect Please use type updateContext `)
  }
}

export function AppContext (props: IProps) {
  const [state, dispatch] = useReducer(reducer, window.__INITIAL_DATA__)
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  )
}
