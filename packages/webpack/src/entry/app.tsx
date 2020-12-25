import * as React from 'react'
import { useReducer } from 'react'
import { IProps, Action } from 'ssr-types'
import { clientContext } from './create-context'

const Context = clientContext
const initialState = window.__INITIAL_DATA__

window.STORE_CONTEXT = Context

function reducer (state: any, action: Action) {
  switch (action.type) {
    case 'updateContext':
      return { ...state, ...action.payload }
    default:
      throw new Error('action type is undefined')
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
