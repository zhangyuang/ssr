import * as fs from 'fs'
import { promises } from 'fs'
import { resolve } from 'path'
import { UserConfig, IPlugin } from 'ssr-types'

const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '')
}

const getFeDir = () => {
  return resolve(getCwd(), process.env.FE_ROOT ?? 'web')
}

const getPagesDir = () => {
  return resolve(getFeDir(), 'pages')
}

const getUserConfig = (): UserConfig => {
  // 生产环境如果有 config.prod 则读取
  const isProd = process.env.NODE_ENV === 'production'
  const hasProdConfig = fs.existsSync(resolve(getCwd(), 'config.prod.js'))
  return require(resolve(getCwd(), isProd && hasProdConfig ? 'config.prod' : 'config'))
}

const loadPlugin = (): IPlugin => {
  return require(resolve(getCwd(), 'plugin'))
}

const isFaaS = async () => {
  const result = await promises.access(resolve(getCwd(), 'f.yml'))
    .then(() => true)
    .catch(() => false)
  return result
}

const getLocalNodeModules = () => resolve(__dirname, '../../../')

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

const checkVite = async () => {
  const result = await accessFile(resolve(getCwd(), './node_modules/vite/package.json'))
  if (!result) {
    console.log('当前项目缺少 vite 依赖，请根据实际技术栈安装 vite @vitejs/plugin-vue 或 其他对应插件')
    return false
  }
  return true
}

const copyViteConfig = async () => {
  // 如果当前项目没有 vite.config 则复制默认的文件
  const result = await accessFile(resolve(getCwd(), './vite.config.js'))
  if (!result) {
    console.log('检测到当前目录缺少 vite.config.js 文件，自动创建默认模版')

    await promises.copyFile(resolve(getCwd(), './node_modules/ssr-plugin-vue3/src/config/vite.config.tpl'), resolve(getCwd(), './vite.config.js'))
  }
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
  accessFile,
  copyViteConfig,
  checkVite
}
