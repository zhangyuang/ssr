import { startClientServer, startServerBuild, startFaasServer } from 'ssr-core'
import { Argv } from 'ssr-server-utils'

const start = async (argv: Argv) => {
  if (argv.mpa) {
    /* todo compile mpa */
    console.log('mpa is developing')
  } else {
    /* compile spa */
    await Promise.all([startClientServer(argv), startServerBuild(argv)])
    startFaasServer(argv)
  }
}

export {
  start
}
