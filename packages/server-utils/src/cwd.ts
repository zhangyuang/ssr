import * as fs from 'fs'
import { promises } from 'fs'
import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
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

const readAsyncChunk = async (): Promise<Record<string, string>> => {
  const cwd = getCwd()
  try {
    const str = (await promises.readFile(resolve(cwd, './build/asyncChunkMap.json'))).toString()
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}

const addAsyncChunk = async (dynamicCssOrder: string[], webpackChunkName: string) => {
  const asyncChunkMap = await readAsyncChunk()
  for (const key in asyncChunkMap) {
    if (asyncChunkMap[key].includes(webpackChunkName)) {
      dynamicCssOrder = dynamicCssOrder.concat(`${key}.css`)
    }
  }
  return dynamicCssOrder
}
const cyrb53 = function (str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed; let h2 = 0x41c6ce57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

const cryptoAsyncChunkName = (chunks: any, asyncChunkMap: Record<string, string>) => {
  // 加密异步模块 name，防止名称过长
  const allChunksNames = chunks.map((item: any) => item.name).join('~')
  const allChunksNamesArr = allChunksNames.split('~')

  const cryptoAllChunksNames = String(cyrb53(allChunksNames))
  if (allChunksNamesArr.length >= 2 && !asyncChunkMap[cryptoAllChunksNames]) {
    asyncChunkMap[cryptoAllChunksNames] = allChunksNamesArr
  }
  return cryptoAllChunksNames
}

const isFaaS = async (fun?: boolean) => {
  const result = await promises.access(resolve(getCwd(), fun ? 'template.yml' : 'f.yml'))
    .then(() => true)
    .catch(() => false)
  return result
}

const getLocalNodeModules = () => resolve(__dirname, '../../../node_modules')

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
    const version = require(resolve(getCwd(), './package.json')).dependencies.vue
    let plugin = ''
    if (version) {
      plugin = /^.?3/.test(version) ? '@vitejs/plugin-vue' : 'vite-plugin-vue2'
    } else {
      plugin = '@vitejs/plugin-react-refresh'
    }
    console.log(`当前项目缺少 vite 依赖，请根据实际技术栈安装 vite ${plugin}${version && !/^.?3/.test(version) ? '@vite-plugin-vue2@1.4.4' : ''} 或 其他对应插件`)
    if (version && !/^.?3/.test(version)) {
      console.log('vue2 场景下使用 Vite 必须安装固定版本 vite-plugin-vue2@1.4.4')
    }
    return false
  }
  return true
}

const copyViteConfig = async () => {
  // 如果当前项目没有 vite.config 则复制默认的文件
  const result = await accessFile(resolve(getCwd(), './vite.config.js'))
  if (!result) {
    const version = require(resolve(getCwd(), './package.json')).dependencies.vue
    console.log('vite.config.js not found, will be created automatically')
    let folder = ''
    if (version) {
      folder = /^.?3/.test(version) ? 'ssr-plugin-vue3' : 'ssr-plugin-vue'
    } else {
      folder = 'ssr-plugin-react'
    }
    await promises.copyFile(resolve(getCwd(), `./node_modules/${folder}/src/config/vite.config.tpl`), resolve(getCwd(), './vite.config.js'))
  } else {
    // 如果有 vite.config.js 则检测是不是最新的
    const buildAlias = require(resolve(getCwd(), './vite.config.js')).resolve?.alias?._build
    if (!buildAlias) {
      throw new Error('当前 vite.config.js 为旧版，请删除后由框架重新创建或手动添加新的 alias 规则 \'_build\': join(process.cwd(), \'./build\')')
    }
  }
}

const execPromisify = promisify(exec)

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
  checkVite,
  execPromisify,
  readAsyncChunk,
  addAsyncChunk,
  cryptoAsyncChunkName
}
