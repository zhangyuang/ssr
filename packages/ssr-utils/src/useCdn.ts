import Shell from 'shelljs'
import axios from 'axios'
import fs from 'fs'
import { resolve } from 'path'
import { Global }from './interface/global'
import { ServerJs }from './interface/config'

const resolveDir = (path: string) => resolve(process.cwd(), path)

declare const global: Global
const getServerBundle = async (cdn: string, path: string): Promise<ServerJs> => {
  console.log('\x1B[32m get serverBundle from CDN file', cdn)
  const res = await axios.get(cdn)
  const str = res.data
  Shell.mkdir(resolveDir('./.serverBundle'))
  fs.writeFileSync(path, str)
  const serverJs = require(path).default
  return serverJs
}

const useCdn = async (serverJs: string): Promise<ServerJs> => {
  let version
  let serverJsPath: string = ''
  let _serverJs
  try {
    version = (/\d+(\.\d+)+/.exec(serverJs) as string[])[0] // cdn地址必须带有版本号
    serverJsPath = resolveDir(`./.serverBundle/server${version}.js`)
  } catch (error) {
    console.log('请检查cdn地址是否符合规范并带有版本号', error)
  }
  delete require.cache[serverJsPath]
  try {
    try {
      fs.statSync(serverJsPath)
      if (global.isLocal) {
        // 本地开发环境每次都从cdn拉取文件
        _serverJs = await getServerBundle(serverJs, serverJsPath)
      }
    } catch (error) {
        // 首次访问本地没有对应的serverJsPath的情况需要从cdn拉取文件
      _serverJs = await getServerBundle(serverJs, serverJsPath)
    }
    if (!global.isLocal) {
        // 正式环境直接require serverBundle
      console.log('\x1B[32m get serverBundle from local file', serverJsPath)
      _serverJs = require(serverJsPath).default
    }
  } catch (error) {
    console.log('error', error)
  }
  return _serverJs
}

export {
    useCdn
}
