import { join } from 'path'

module.exports = appInfo => {
  const exports = {} as any

  exports.middleware = ['staticFile']

  exports.static = {
    prefix: '/',
    dir: join(appInfo.baseDir, '../build')
  }
  return exports
}
