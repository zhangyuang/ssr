import { useReducer, createElement } from 'react'
import { IProps, Action, IWindow, ReactRoutesType } from 'ssr-types'
import { Routes } from './create'

const { reducer, state } = Routes as ReactRoutesType

const userState = state ?? {}
const userReducer = reducer ?? function() { }

const isDev = process.env.NODE_ENV !== 'production'

declare const window: IWindow

function defaultReducer(state: any, action: Action) {
  switch (action.type) {
    case 'updateContext':
      if (isDev) {
        console.log('[SSR:updateContext]: dispatch updateContext with action')
        console.log(action)
      }
      return { ...state, ...action.payload }
  }
}


function combineReducer(state: any, action: any) {
  return defaultReducer(state, action) || userReducer(state, action)
}

export function AppContext(props: IProps) {
  const initialState = Object.assign({}, userState ?? {}, __isBrowser__ ? window?.__INITIAL_DATA__ : props.initialState)
  const [state, dispatch] = useReducer(combineReducer, initialState)
  return createElement(props.context.Provider, {
    value: {
      state,
      dispatch
    }
  }, props.children as any)
}
