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

declare module 'ssr-deepclone' {
  const deepClone: (obj: any) => any
}

declare module '_build/ssr-declare-routes' { }
declare module '_build/ssr-manual-routes' { }
declare module '_build/staticConfig' {}
declare module 'koa2-connect' {
  export default (params: any): any => { }
}

