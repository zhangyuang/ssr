import { clientServer } from '@ssr/core'
import { Argv } from './interface/argv'

const start = async (argv: Argv) => {
  await clientServer()
}

export {
  start
}
