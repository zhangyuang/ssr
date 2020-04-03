import { startClientServer, startServerBuild } from 'ssr-core'

const start = (argv) => {
  if (argv.mpa) {
    // todo compile mpa
  } else {
    // compile spa
    startClientServer()
    startServerBuild()
  }
}

export {
  start
}
