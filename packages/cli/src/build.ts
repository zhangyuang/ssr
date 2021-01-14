import { startClientBuild, startServerBuild } from 'ssr-webpack'
import { Argv } from 'ssr-server-utils'

const build = async (argv: Argv) => {
  await Promise.all([startClientBuild(argv), startServerBuild(argv)])
}

export {
  build
}
