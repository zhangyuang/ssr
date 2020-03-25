import { clientServer } from '@ssr/core'
import { Argv } from '@ssr/utils'

const start = async (argv: Argv) => {
  await clientServer(argv)
}

export {
  start
}
