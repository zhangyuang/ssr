import * as React from 'react'
import { useReducer } from 'react'
import { IProps, Action } from 'ssr-types'
import { IContext } from './create-context'

// 客户端的 context  只需要创建一次，在页面整个生命周期内共享
const Context = IContext
const initialState = window.__INITIAL_DATA__

window.STORE_CONTEXT = Context

function reducer (state: any, action: Action) {
  switch (action.type) {
    case 'updateContext':
      return { ...state, ...action.payload }
    default:
      throw new Error('Action type is undefined Please use type updateContext ')
  }
}

export function App (props: IProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  )
}
