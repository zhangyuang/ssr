
import { Argv } from 'ssr-server-utils'
import { webpackPromisify } from '../utils/promisify'
import { getServerWebpack, buildConfig } from '../config'

const { webpackStatsOption } = buildConfig

const startServerBuild = async (argv: Argv) => {
  const serverConfig = getServerWebpack()
  const stats = await webpackPromisify(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
