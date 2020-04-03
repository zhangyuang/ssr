import { startClientServer, startServerBuild } from 'ssr-core'

const start = (argv) => {
  startClientServer(argv)
  startServerBuild()
}

export {
  start
}
