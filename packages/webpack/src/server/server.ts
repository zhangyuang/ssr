
import { buildConfig } from 'ssr-server-utils'
import { getServerWebpack } from '../config'
import { webpackPromisify } from '../utils/promisify'

const { webpackStatsOption } = buildConfig

const startServerBuild = async () => {
  const serverConfig = getServerWebpack()
  const stats = await webpackPromisify(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
