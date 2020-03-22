
import { FC } from './fc'

export interface RouteItem {
  path: string
  exact?: boolean
  Component: () => FC
}
