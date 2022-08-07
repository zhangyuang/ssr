import type { ReactChild } from 'react'
import type { RouteComponentProps } from 'react-router-dom'

type IProps<T={}> = T & {
  children: ReactChild
}

type SProps<T={}> = T & RouteComponentProps

interface Action {
  type: string
  payload: object
}

export {
  IProps,
  Action,
  SProps
}
