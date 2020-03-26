import * as fs from 'fs'
import { join } from 'path'
import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import { clientConfig }from './webapck-config/client'
import { appConfig } from './webapck-config/config'

const { root, port, dist, publicPath } = appConfig

// const ora = require('ora')('正在构建')

const startClientServer = (argv) => {
  const compiler = webpack(clientConfig)
  const server = new webpackDevServer(compiler, {
    quiet: true,
    disableHostCheck: true,
    publicPath: publicPath,
    hotOnly: true,
    host: '0.0.0.0',
    sockPort: port,
    contentBase: `${root}/${dist}`,
    hot: true,
    port: port,
    clientLogLevel: 'error',
    headers: {
      'access-control-allow-origin': '*'
    }
  })
  server.listen(port, '0.0.0.0')
}

const startClientBuild = async () => {
  // const outputPath = clientConfig.output.path
  // ora.start()
  // const stats: any = await webpackWithPromise(clientConfig)
  // console.log(stats.toString({
  //   assets: true,
  //   colors: true,
  //   hash: true,
  //   timings: true,
  //   version: true,
  //   warnings: false
  // }))
  // const stream = await renderLayout()
  // let writeStream
  // try {
  //     // 如果当前没有dist目录则创建目录
  //   fs.statSync(join(outputPath, './index.html'))
  //   writeStream = fs.createWriteStream(join(outputPath, './index.html'))
  //   stream.pipe(writeStream)
  // } catch (error) {
  //   mkdir(join(outputPath))
  //   writeStream = fs.createWriteStream(join(outputPath, './index.html'))
  //   stream.pipe(writeStream)
  // }
  // ora.succeed()
}

export {
  startClientServer,
  startClientBuild
}
