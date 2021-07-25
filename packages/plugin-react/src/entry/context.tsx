import * as React from 'react'
import { useReducer } from 'react'
import { IProps, Action, IWindow, ReactClientRoutesType } from 'ssr-types-react'
import { combineReducers } from 'ssr-client-utils'

import { clientContext as Context } from './create-context'

// @ts-expect-error
import * as Routes from 'ssr-temporary-routes'

const { reducer, state } = Routes as ReactClientRoutesType

const userState = state ?? {}
const userReducer = reducer ?? function () {}

const isDev = process.env.NODE_ENV !== 'production'

// 客户端的 context  只需要创建一次，在页面整个生命周期内共享
declare const window: IWindow

window.STORE_CONTEXT = Context

function defaultReducer (state: any, action: Action) {
  switch (action.type) {
    case 'updateContext':
      if (isDev) {
        console.log('[SSR:updateContext]: dispatch updateContext with action')
        console.log(action)
      }
      return { ...state, ...action.payload }
  }
}
const [reducerCombined, initialStateCombined] = combineReducers({
  defaultReducer: [defaultReducer, window.__INITIAL_DATA__],
  userReducer: [userReducer, userState]
})

export function AppContext (props: IProps) {
  const [state, dispatch] = useReducer(reducerCombined, initialStateCombined)
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  )
}
