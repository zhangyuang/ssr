import { join } from 'path'
import axios from 'axios'
import { getCwd } from './cwd'
import { loadConfig } from './loadConfig'

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
    const res = await axios.get(`${https ? 'https' : 'http'}://localhost:${fePort}/asset-manifest.json`)
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
