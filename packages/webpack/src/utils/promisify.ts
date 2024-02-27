import * as webpack from 'ssr-webpack4'
import type { Stats, Configuration, Compiler } from 'webpack'

const errorEmitPlugin = function (compiler: Compiler) {
  compiler.hooks.done.tapAsync('done', function (stats, callback) {
    if (stats.compilation.errors.length > 0) {
      const isDev = process.env.NODE_ENV !== 'production'
      console.error(stats.compilation.errors)
      if (!isDev) {
        process.exit(1)
      }
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
