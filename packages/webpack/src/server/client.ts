import * as webpack from 'webpack'
import { webpackPromisify } from '../utils/promisify'

const WebpackDevServer = require('webpack-dev-server-ssr')

const startClientServer = async (config) => {
  const { port, host, webpackDevServerConfig, fePlugin } = config
  return await new Promise((resolve) => {
    const clientConfig = fePlugin.getClientWebpack(config)
    const compiler = webpack(clientConfig)
    const server = new WebpackDevServer(compiler, webpackDevServerConfig)
    compiler.hooks.done.tap('WebpackDevMiddleware', (stats) => {
      // Do the stuff in nextTick, because bundle may be invalidated
      // if a change happened while compiling
      resolve()
    })
    server.listen(port, host)
  })
}

const startClientBuild = async (config) => {
  const { webpackStatsOption, fePlugin } = config
  const clientConfig = fePlugin.getClientWebpack(config)

  const stats = await webpackPromisify(clientConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startClientServer,
  startClientBuild
}
