
import { webpackPromisify } from '../utils/promisify'

const startServerBuild = async (config) => {
  const { webpackStatsOption, fePlugin } = config
  const serverConfig = fePlugin.getServerWebpack(config)
  const stats = await webpackPromisify(serverConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startServerBuild
}
