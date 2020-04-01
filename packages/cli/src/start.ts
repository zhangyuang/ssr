import { startClientServer, startServerBuild } from 'ssr-core'

const start = () => {
  startClientServer()
  startServerBuild()
}

export {
  start
}
