import * as webpack from 'webpack'
import { Stats, Configuration, Compiler } from 'webpack'

const errorEmitPlugin = function (compiler: Compiler) {
  compiler.hooks.done.tapAsync('done', function (stats, callback) {
    if (stats.compilation.errors.length > 0) {
      throw new Error(
        JSON.stringify(stats.compilation.errors.map(err => err.message || err))
      )
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
