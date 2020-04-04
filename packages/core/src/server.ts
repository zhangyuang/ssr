import * as webpack from 'webpack'
import { webpackError } from 'ssr-client-utils'
import { getServerWebpack }from './webapck-config/server'
import { webpackStatsOption } from './webapck-config/config'

const startServerBuild = (argv) => {
  const serverConfig = getServerWebpack(argv)
  webpack(serverConfig, (err, stats) => {
    webpackError(err, stats)
    console.log(stats.toString(webpackStatsOption))
  })
}

export {
  startServerBuild
}
