import { join } from 'path'
import { getCwd } from './cwd'
import { getPromisify } from './promisify'
import { loadConfig } from './loadConfig'

let manifest: {
  [key: string]: string
} = {}

const getManiFest = async () => {
  const { isDev, fePort } = loadConfig()

  if (Object.keys(manifest).length !== 0) {
    return
  }
  const cwd = getCwd()
  if (isDev) {
    manifest = await getPromisify(`http://localhost:${fePort}/asset-manifest.json`)
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
