import { promises, accessSync, realpathSync } from 'fs'
import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { UserConfig, Json, SSRModule } from 'ssr-types'
import { coerce } from 'semver'
import { rm } from 'shelljs'
import { loadConfig } from './loadConfig'

const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '')
}

const getFeDir = () => {
  return resolve(getCwd(), process.env.FE_ROOT ?? 'web')
}

const getPagesDir = () => {
  return resolve(getFeDir(), 'pages')
}

const cleanOutClientDir = () => {
  rm('-rf', resolve(getCwd(), './build/client'))
}

const writeRoutes = async (routes: string, name?: string) => {
  const cwd = getCwd()
  await promises.writeFile(resolve(cwd, `./build/${name ?? 'ssr-declare-routes'}`), routes)
}

const getWebpackSplitCache = () => {
  const { optimize } = loadConfig()
  if (optimize) {
    const generateMap: Record<string, string> = require(resolve(getCwd(), './build/generateMap.json'))
    const asyncChunkMap = require(resolve(getCwd(), './build/asyncChunkMap.json'))
    let maxPriority = Object.keys(asyncChunkMap).length + 1
    const splitPriorityMap: Record<string, number|undefined> = {
      'common-vendor': maxPriority + 1,
      'layout-app': maxPriority
    }
    // make priority consistent
    Object.keys(asyncChunkMap).sort((a, b) => {
      const lenA = asyncChunkMap[a]
      const lenB = asyncChunkMap[b]
      if (lenA !== lenB) {
        return asyncChunkMap[b].length - asyncChunkMap[a].length
      } else {
        return a > b ? 1 : -1
      }
    }).forEach(chunkName => {
      splitPriorityMap[chunkName] = maxPriority - 1
      maxPriority--
    })
    const webpackMap: Record<string, string[]> = {}
    for (const fileName in generateMap) {
      const chunkName = generateMap[fileName]
      if (!webpackMap[chunkName]) {
        webpackMap[chunkName] = []
      }
      webpackMap[chunkName].push(fileName)
    }
    const cacheGroups: Record<string, {
      name: string
      test: (module: SSRModule) => boolean | undefined
      priority: number
    }> = {}
    for (const chunkName in webpackMap) {
      const arr = webpackMap[chunkName]
      if (!cacheGroups[chunkName]) {
        cacheGroups[chunkName] = {
          name: chunkName,
          test: (module) => {
            if (chunkName === 'void' || !module.nameForCondition?.()) return
            const nameForCondition = module.nameForCondition()
            return checkContains(arr, nameForCondition)
          },
          priority: splitPriorityMap[chunkName] ?? 0
        }
      }
    }
    return cacheGroups
  } else {
    return {
      vendors: {
        test: (module: SSRModule) => {
          return module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.match('node_modules')
        },
        name: 'vendor'
      }
    }
  }
}

const checkContains = (arr: string[], name: string) => {
  for (const val of arr) {
    if (val.includes(name)) {
      return true
    }
  }
  return false
}

const checkContainsRev = (arr: string[], name: string) => {
  for (const val of arr) {
    if (name.includes(val)) {
      return true
    }
  }
  return false
}

const getSplitChunksOptions = (asyncChunkMap: {
  val: Record<string, string[]>
}) => {
  const { optimize } = loadConfig()
  return {
    minSize: optimize ? 0 : 2000,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    chunks: 'all',
    name (module: SSRModule, chunks: any, cacheGroupKey: string) {
      return cryptoAsyncChunkName(chunks, asyncChunkMap.val)
    },
    cacheGroups: getWebpackSplitCache()
  }
}

const transformConfig = async () => {
  // serverless 发布无需安装 shelljs esbuild, 提前本地 build 好
  const { cp, mkdir } = await import('shelljs')
  const { transform } = await import('esbuild')
  const cwd = getCwd()
  if (!await accessFile(resolve(cwd, './build'))) {
    mkdir(resolve(cwd, './build'))
  }
  if (await accessFile(resolve(cwd, './config.js'))) {
    cp('-r', `${resolve(cwd, './config.js')}`, `${resolve(cwd, './build/config.js')}`)
  }
  const configWithTs = await accessFile(resolve(cwd, './config.ts'))
  if (configWithTs) {
    const fileContent = (await promises.readFile(resolve(cwd, './config.ts'))).toString()
    const { code } = await transform(fileContent, {
      loader: 'ts',
      format: 'cjs',
      keepNames: true
    })
    await promises.writeFile(resolve(cwd, './build/config.js'), code)
  }
}

const cpManualRoutes = async () => {
  const cwd = getCwd()
  const declaretiveRoutes = await accessFile(resolve(getFeDir(), './route.ts')) // 是否存在自定义路由
  if (!declaretiveRoutes) {
    await promises.writeFile(resolve(cwd, './build/ssr-manual-routes.js'), '')
    return
  }
  const { cp } = await import('shelljs')
  cp(resolve(getFeDir(), './route.ts'), resolve(cwd, './build/ssr-manual-routes.ts'))
}

const getUserConfig = (): UserConfig => {
  const defaultConfig = resolve(getCwd(), './build/config.js')
  return accessFileSync(defaultConfig) ? require(defaultConfig) : {} // for dynamic file
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

const cryptoAsyncChunkName = (chunks: Array<{name: string}>, asyncChunkMap: Record<string, string[]>) => {
  // 加密异步模块 name，防止名称过长
  chunks.sort((a, b) => a.name > b.name ? -1 : 1) // 保证相同值不同顺序的数组最终的加密结果一致
  const allChunksNames = chunks.map(item => item.name).join('~')
  const allChunksNamesArr = allChunksNames.split('~')
  const cryptoAllChunksNames = String(chunks.length > 3 ? cyrb53(allChunksNames) : allChunksNames)
  if (allChunksNamesArr.length >= 2 && !asyncChunkMap?.[cryptoAllChunksNames]) {
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

const judgeFramework = () => {
  const cwd = getCwd()
  const packageJSON = require(resolve(cwd, './package.json'))
  if (packageJSON.dependencies.react || packageJSON.devDependencies.react) {
    return 'ssr-plugin-react'
  } else if (packageJSON.dependencies.vue || packageJSON.devDependencies.vue) {
    const version = packageJSON.dependencies.vue || packageJSON.devDependencies.vue
    return coerce(version)!.major === 3 ? 'ssr-plugin-vue3' : 'ssr-plugin-vue'
  } else {
    throw new Error('get framework failed, please check dependencies')
  }
}

const judgeVersion = (version: string) => {
  return coerce(version)
}

const judgeServerFramework = () => {
  const cwd = getCwd()
  const packageJSON = require(resolve(cwd, './package.json'))
  if (packageJSON.dependencies['@midwayjs/decorator']) {
    return 'ssr-plugin-midway'
  } else {
    return 'ssr-plugin-nestjs'
  }
}

const loadModuleFromFramework = (path: string) => {
  const framework = judgeFramework()
  const paths = resolve(getCwd(), `./node_modules/${framework}`)
  try {
    return require.resolve(path, {
      paths: [accessFileSync(paths) ? realpathSync(paths) : paths]
    })
  } catch (error) {
    return ''
  }
}

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

const accessFileSync = (file: string) => {
  let res = true
  try {
    accessSync(file)
  } catch (error) {
    res = false
  }
  return res
}

const copyReactContext = async () => {
  await promises.copyFile(resolve(getCwd(), './node_modules/ssr-plugin-react/src/entry/create-context.ts'), resolve(getCwd(), './build/create-context.ts'))
}

const execPromisify = promisify(exec)

const stringifyDefine = (obj: {[key: string]: Json}) => {
  for (const key in obj) {
    const val = obj[key]
    if (typeof val === 'string' && val.slice(0, 1) !== '"') {
      obj[key] = JSON.stringify(val)
    } else if (typeof val === 'object') {
      stringifyDefine(val)
    }
  }
}

export {
  getCwd,
  getFeDir,
  getPagesDir,
  getUserConfig,
  isFaaS,
  processError,
  accessFile,
  execPromisify,
  cryptoAsyncChunkName,
  copyReactContext,
  transformConfig,
  accessFileSync,
  judgeFramework,
  loadModuleFromFramework,
  cpManualRoutes,
  writeRoutes,
  stringifyDefine,
  judgeServerFramework,
  judgeVersion,
  getWebpackSplitCache,
  getSplitChunksOptions,
  cleanOutClientDir,
  checkContainsRev
}
