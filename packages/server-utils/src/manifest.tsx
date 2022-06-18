import { join } from 'path'
import axios from 'axios'
import { IConfig } from 'ssr-types'
import { getCwd } from './cwd'

// 创建一个实例来请求，防止业务代码的 axios 设置了 defaults 配置导致获取 manifest 失败
const instance = axios.create({
  timeout: 3000,
  proxy: false
})

const getManifest = async (config: IConfig): Promise<Record<string, string|undefined>> => {
  const { isDev, fePort, https, manifestPath, isVite } = config
  let manifest = {}
  const cwd = getCwd()
  if (isDev && !isVite) {
    const res = await instance.get(`${https ? 'https' : 'http'}://0.0.0.0:${fePort}${manifestPath}`)
    manifest = res.data
  } else if (!isDev) {
    manifest = require(join(cwd, './build/client/asset-manifest.json'))
  }
  return manifest
}

export {
  getManifest
}
