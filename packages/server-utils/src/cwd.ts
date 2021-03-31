import * as fs from 'fs'
import { promises } from 'fs'
import { join, isAbsolute } from 'path'
import { UserConfig, IPlugin } from 'ssr-types'

const getCwd = () => {
  const cwd = process.cwd()
  if (process.env.APP_ROOT) {
    // avoid repeat cwd path
    if (!isAbsolute(process.env.APP_ROOT)) {
      return join(cwd, process.env.APP_ROOT)
    }
    return process.env.APP_ROOT
  }
  return cwd
}

const getFeDir = () => {
  // fe component folder path
  const cwd = getCwd()
  if (process.env.FE_ROOT) {
    // avoid repeat cwd path
    if (!isAbsolute(process.env.FE_ROOT)) {
      return join(cwd, process.env.FE_ROOT)
    }
    return process.env.FE_ROOT
  }
  return join(cwd, './web')
}

const getPagesDir = () => {
  return join(getFeDir(), './pages')
}

const getUserConfig = (): UserConfig => {
  // 生产环境如果有 config.prod 则读取
  const isProd = process.env.NODE_ENV === 'production'
  const hasProdConfig = fs.existsSync(join(getCwd(), './config.prod.js'))
  return require(join(getCwd(), isProd && hasProdConfig ? './config.prod' : './config'))
}

const loadPlugin = (): IPlugin => {
  return require(join(getCwd(), './plugin'))
}

const isFaaS = async () => {
  const result = await promises.access(join(getCwd(), './f.yml'))
    .then(() => true)
    .catch(() => false)
  return result
}

const getLocalNodeModules = () => join(__dirname, '../../../')

const processError = (err: any) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}
const accessFile = async (file: string) => {
  const result = await promises.access(file)
    .then(() => true)
    .catch(() => false)
  return result
}
export {
  getCwd,
  getFeDir,
  getPagesDir,
  getUserConfig,
  isFaaS,
  loadPlugin,
  getLocalNodeModules,
  processError,
  accessFile
}
