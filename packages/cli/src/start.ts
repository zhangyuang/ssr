import { startClientServer } from 'ssr-core'
import { Argv } from '../../client-utils/cjs'

const start = async (argv: Argv) => {
  await startClientServer(argv)
}

export {
  start
}
