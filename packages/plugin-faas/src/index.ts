
import { start } from './start'
import { deploy } from './deploy'

export function faasPlugin () {
  return {
    name: 'plugin-midway-faas',
    start,
    deploy
  }
}
