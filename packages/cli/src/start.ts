import { startClientServer, startServerBuild, startFaasServer } from 'ssr-core'

const start = async (argv) => {
  if (argv.mpa) {
    // todo compile mpa
    console.log('mpa is developing')
  } else {
    /* compile spa */
    // startClientServer()
    await startServerBuild(argv)
    startFaasServer(argv)
  }
}

export {
  start
}
