import type { Context, ReactChild } from 'react'
import type { RouteComponentProps } from 'react-router-dom'
import type { IContext } from './route'

type IProps<T = {}> = T & {
	children: ReactChild
	initialState?: any
	context: Context<IContext>
}

type SProps<T = {}> = T & RouteComponentProps

interface Action {
	type: string
	payload: object
}

export { IProps, Action, SProps }
