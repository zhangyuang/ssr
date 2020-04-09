import { promisify } from 'util'
import * as webpack from 'webpack'
import { getServerWebpack, buildConfig }from 'ssr-webpack'
import { Argv }from 'ssr-server-utils'

const { webpackStatsOption } = buildConfig
const webpackPromise = promisify<webpack.Configuration, webpack.Stats>(webpack)

const startServerBuild = async (argv: Argv) => {
  const serverConfig = getServerWebpack(argv)
  const stats = await webpackPromise(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
