import { join } from 'path'
import axios from 'axios'
import { getCwd } from './cwd'
import { loadConfig } from './loadConfig'

// 创建一个实例来请求，防止业务代码的 axios 设置了 defaults 配置导致获取 manifest 失败
const instance = axios.create({
  timeout: 3000,
  proxy: false
})

const getManiFest = async (): Promise<Record<string, string>> => {
  const { isDev, fePort, https } = loadConfig()
  let manifest = {}
  const cwd = getCwd()
  if (isDev) {
    const res = await instance.get(`${https ? 'https' : 'http'}://localhost:${fePort}/asset-manifest.json`)
    manifest = res.data
  } else {
    manifest = require(join(cwd, './build/client/asset-manifest.json'))
  }
  return manifest
}
const getManifest = async () => {
  return await getManiFest()
}

export {
  getManifest
}
