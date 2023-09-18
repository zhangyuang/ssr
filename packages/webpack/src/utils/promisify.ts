import * as webpack from 'ssr-webpack4'

import { Stats, Configuration, Compiler } from 'webpack'
const errorEmitPlugin = function (compiler: Compiler) {
  compiler.hooks.done.tapAsync('done', function (stats, callback) {
    if (stats.compilation.errors.length > 0) {
      throw new Error(stats.compilation.errors[0].stack)
    }
    callback()
  })
}
const webpackPromisify = async (config: Configuration): Promise<Stats> => {
  config.plugins?.push(errorEmitPlugin)
  return await new Promise((resolve, reject) => {
    webpack(config, (err, stats: Stats) => {
      if (err) {
        reject(err)
      }
      resolve(stats)
    })
  })
}

export {
  webpackPromisify
}
