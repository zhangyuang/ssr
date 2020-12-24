import * as React from 'react'
import { useReducer } from 'react'
import { clientContext } from './create-context'

const Context = clientContext
const initialState = window.__INITIAL_DATA__
window.STORE_CONTEXT = Context

function reducer (state, action) {
  switch (action.type) {
    case 'updateContext':
      return { ...state, ...action.payload }
    default:
      throw new Error()
  }
}
export function App (props) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  )
}
