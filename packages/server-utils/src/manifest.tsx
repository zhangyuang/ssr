import { join } from 'path'
import axios from 'axios'
import { getCwd } from './cwd'
import { loadConfig } from './loadConfig'

// 创建一个实例来请求，防止业务代码的 axios 设置了 defaults 配置导致获取 manifest 失败
const instance = axios.create({
  timeout: 3000,
  proxy: false
})

let manifest: {
  [key: string]: string
} = {}

const getManiFest = async () => {
  const { isDev, fePort, https } = loadConfig()

  if (Object.keys(manifest).length !== 0) {
    return
  }
  const cwd = getCwd()
  if (isDev) {
    const res = await instance.get(`${https ? 'https' : 'http'}://localhost:${fePort}/asset-manifest.json`)
    manifest = res.data
  } else {
    manifest = require(join(cwd, './build/client/asset-manifest.json'))
  }
}
const getManifest = async () => {
  await getManiFest()
  return manifest
}

export {
  getManifest
}
