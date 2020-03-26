import { startClientServer } from '@ssr/core'
import { Argv } from '@ssr/utils'

const start = async (argv: Argv) => {
  await startClientServer(argv)
}

export {
  start
}
