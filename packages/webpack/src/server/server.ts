
import { webpackPromisify } from '../utils/promisify'

const startServerBuild = async (webpackConfig, config) => {
  const { webpackStatsOption } = config.buildConfig
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
