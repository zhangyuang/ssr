import { loadConfig } from 'ssr-server-utils'
import { webpackPromisify } from '../utils/promisify'

const config = loadConfig()
const startServerBuild = async (webpackConfig) => {
  const { webpackStatsOption } = config.buildConfig
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
