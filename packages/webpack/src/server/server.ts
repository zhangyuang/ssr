import { loadConfig } from 'ssr-server-utils'
import { webpackPromisify } from '../utils/promisify'

const startServerBuild = async (webpackConfig) => {
  const { webpackStatsOption } = loadConfig()
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
