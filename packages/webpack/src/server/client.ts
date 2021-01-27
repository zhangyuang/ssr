import * as webpack from 'webpack'
import { loadConfig } from 'ssr-server-utils'
import { webpackPromisify } from '../utils/promisify'

const WebpackDevServer = require('webpack-dev-server-ssr')
const config = loadConfig()

const startClientServer = async (webpackConfig) => {
  const { webpackDevServerConfig } = config
  const { port, host } = config.buildConfig
  return await new Promise((resolve) => {
    const compiler = webpack(webpackConfig)
    const server = new WebpackDevServer(compiler, webpackDevServerConfig)
    compiler.hooks.done.tap('WebpackDevMiddleware', (stats) => {
      resolve()
    })
    server.listen(port, host)
  })
}

const startClientBuild = async (webpackConfig) => {
  const { webpackStatsOption } = config.buildConfig
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startClientServer,
  startClientBuild
}
