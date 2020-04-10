import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import { getClientWebpack, buildConfig }from 'ssr-webpack'
import { webpackPromisify } from './utils/promisify'
import { Argv } from 'ssr-types'

const { webpackDevServerConfig, port, host, webpackStatsOption } = buildConfig

const startClientServer = (argv: Argv) => {
  return new Promise((resolve, reject) => {
    const clientConfig = getClientWebpack(argv)
    const compiler = webpack(clientConfig)
    const server = new webpackDevServer(compiler, webpackDevServerConfig)
    compiler.hooks.done.tap('WebpackDevMiddleware', (stats) => {
      // Do the stuff in nextTick, because bundle may be invalidated
      // if a change happened while compiling
      resolve()
    })
    server.listen(port, host)
  })
}

const startClientBuild = async (argv: Argv) => {
  const clientConfig = getClientWebpack(argv)
  const ora = require('ora')('正在构建')
  ora.start()
  const stats = await webpackPromisify(clientConfig)
  console.log(stats.toString(webpackStatsOption))
  ora.succeed()
}

export {
  startClientServer,
  startClientBuild
}
