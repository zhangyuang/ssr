import { startClientServer, startServerBuild } from 'ssr-core'

const start = (argv) => {
  if (argv.mpa) {
    // todo compile mpa
    console.log('mpa is developing')
  } else {
    // compile spa
    // startClientServer()
    startServerBuild(argv)
  }
}

export {
  start
}
