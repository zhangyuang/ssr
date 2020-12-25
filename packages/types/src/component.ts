import { ReactChild } from 'react'
import { RouteComponentProps } from 'react-router-dom'

type IProps<T={}> = T & RouteComponentProps & {
  children: ReactChild
}

interface Action {
  type: string
  payload: object
}

export {
  IProps,
  Action
}
