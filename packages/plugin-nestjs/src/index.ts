
import { start } from './start'
import { build } from './build'

export function nestjsPlugin () {
  return {
    start,
    build
  }
}
