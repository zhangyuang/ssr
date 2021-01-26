
import { start } from './start'
import { deploy } from './deploy'

export function faasPlugin () {
  return {
    start,
    deploy
  }
}
