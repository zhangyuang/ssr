
import { start } from './start'
import { build } from './build'
import { deploy } from './deploy'

export function nestjsPlugin () {
  return {
    start,
    build,
    deploy
  }
}
