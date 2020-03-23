// 本文件目的是以React jsx 为模版替换掉html-webpack-plugin以及传统模版引擎, 统一ssr/csr都使用React组件来作为页面的骨架和内容部分
import fs from 'fs'
import { join } from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { mkdir } from 'shelljs'
import { webpackWithPromise } from './util'
import { clientConfig }from './webapck-config/client'
import { appConfig } from './webapck-config/config'

const { PORT,root,dist,publicPath } = appConfig
const ora = require('ora')('正在构建')

const dev = () => {
  const compiler = webpack(clientConfig)
  const server = new WebpackDevServer(compiler, {
    quiet: true,
    disableHostCheck: true,
    publicPath: publicPath,
    hotOnly: true,
    host: '0.0.0.0',
    sockPort: PORT,
    contentBase: `${root}/${dist}`,
    hot: true,
    port: PORT,
    clientLogLevel: 'error',
    headers: {
      'access-control-allow-origin': '*'
    }
  })
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Starting server on http://localhost:${PORT}`)
    process.send && process.send({ msg: 'start dev finish' })
  })
}

const build = async () => {
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

module.exports = {
  dev,
  build
}
