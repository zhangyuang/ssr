
import { getServerWebpack, buildConfig }from 'ssr-webpack'
import { webpackPromisify } from './utils/promisify'
import { Argv }from 'ssr-server-utils'

const { webpackStatsOption } = buildConfig

const startServerBuild = async (argv: Argv) => {
  const serverConfig = getServerWebpack(argv)
  const stats = await webpackPromisify(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
