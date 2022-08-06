declare module '_build/create-context' {
  import type { Context, Dispatch } from 'react'
  interface IContext<T = any> {
    state?: T
    dispatch?: Dispatch<Action>
  }
  interface Action {
    type: string
    payload: object
  }
  const STORE_CONTEXT: Context<IContext>
}
