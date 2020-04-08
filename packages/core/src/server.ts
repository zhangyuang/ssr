import { promisify } from 'util'
import * as webpack from 'webpack'
import { getServerWebpack, webpackStatsOption }from 'ssr-webpack'
import { Argv }from 'ssr-server-utils'

const webpackPromise = promisify<webpack.Configuration, webpack.Stats>(webpack)

const startServerBuild = async (argv: Argv) => {
  const serverConfig = getServerWebpack(argv)
  const stats = await webpackPromise(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
