
import { start } from './start'
import { build } from './build'

export function midwayPlugin () {
  return {
    name: 'plugin-midway',
    start,
    build
  }
}
