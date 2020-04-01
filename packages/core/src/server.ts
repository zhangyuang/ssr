import * as webpack from 'webpack'
import { errorCatch } from 'ssr-client-utils'
import { getServerWebpack }from './webapck-config/server'
import { webpackStatsOption } from './webapck-config/config'

const startServerBuild = () => {
  const serverConfig = getServerWebpack()
  webpack(serverConfig, (err, stats) => {
    errorCatch(err, stats)
    console.log(stats.toString(webpackStatsOption))
  })
}

export {
  startServerBuild
}
