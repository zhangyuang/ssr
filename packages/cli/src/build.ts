import { startClientBuild, startServerBuild } from 'ssr-webpack'
import { Argv } from 'ssr-server-utils'

const build = async (argv: Argv) => {
  if (argv.mpa) {
    /* todo compile mpa */
    console.log('mpa is developing')
  } else {
    /* compile spa */
    await Promise.all([startClientBuild(argv), startServerBuild(argv)])
  }
}

export {
  build
}
