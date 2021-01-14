import { startClientServer, startServerBuild, startFaasServer } from 'ssr-webpack'
import { Argv } from 'ssr-server-utils'

const start = async (argv: Argv) => {
  await Promise.all([startClientServer(argv), startServerBuild(argv)])
  startFaasServer()
}

export {
  start
}
