import { RouteComponentProps } from 'react-router-dom'

type IProps<T={}> = T & RouteComponentProps

interface Action {
  type: string
  payload: object
}

export {
  IProps,
  Action
}
