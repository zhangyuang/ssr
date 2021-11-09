import * as React from 'react'
import { useReducer } from 'react'
import { IProps, Action, IWindow, ReactRoutesType } from 'ssr-types-react'

// @ts-expect-error
import { STORE_CONTEXT } from '_build/create-context'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'

const { reducer, state } = Routes as ReactRoutesType

const userState = state ?? {}
const userReducer = reducer ?? function () {}

const isDev = process.env.NODE_ENV !== 'production'

// 客户端的 context  只需要创建一次，在页面整个生命周期内共享
declare const window: IWindow

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

const initialState = Object.assign({}, userState ?? {}, window.__INITIAL_DATA__)

function combineReducer (state: any, action: any) {
  return defaultReducer(state, action) || userReducer(state, action)
}
export function AppContext (props: IProps) {
  const [state, dispatch] = useReducer(combineReducer, initialState)
  return (
    <STORE_CONTEXT.Provider value={{ state, dispatch }}>
      {props.children}
    </STORE_CONTEXT.Provider>
  )
}
