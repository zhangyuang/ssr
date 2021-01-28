
import { start } from './start'
import { deploy } from './build'

export function midwayPlugin () {
  return {
    start,
    deploy
  }
}
