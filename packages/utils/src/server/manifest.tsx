import axios from 'axios'
import { IConfig } from 'ssr-types'

// 创建一个实例来请求，防止业务代码的 axios 设置了 defaults 配置导致获取 manifest 失败
const instance = axios.create({
  timeout: 3000,
  proxy: false
})

const getManifest = async (config: IConfig): Promise<Record<string, string|undefined>> => {
  const { isDev, fePort, https, manifestPath, isVite, dynamicFile } = config
  let manifest = {}
  if (dynamicFile.configFile ?? !isDev) {
    manifest = require(dynamicFile.assetManifest)
  } else if (isDev && !isVite) {
    const res = await instance.get(`${https ? 'https' : 'http'}://0.0.0.0:${fePort}${manifestPath}`)
    manifest = res.data
  }
  return manifest
}

export {
  getManifest
}
