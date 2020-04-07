import * as webpack from 'webpack'
import { getServerWebpack, webpackStatsOption }from 'ssr-webpack-config'
import { promisify } from 'util'

const webpackPromise = promisify<webpack.Configuration, webpack.Stats>(webpack)

const startServerBuild = async (argv) => {
  const serverConfig = getServerWebpack(argv)
  const stats = await webpackPromise(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
