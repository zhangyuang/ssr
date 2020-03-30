import { getCwd } from '@ssr/utils'

type ClientLogLevel = 'error'
const publicPath = '/'
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

const isDev = process.env.NODE_ENV === 'development'
const port = 8000
const cwd = getCwd()
const chunkName = 'Page'
const clientOutPut = 'build/client'
const serverOutPut = 'build/server'
const clientLogLevel: ClientLogLevel = 'error'
const useHash = false
const webpackDevServerConfig = {
  quiet: true,
  disableHostCheck: true,
  publicPath: publicPath,
  hotOnly: true,
  host: '0.0.0.0',
  sockPort: port,
  contentBase: `${cwd}/${clientOutPut}`,
  hot: true,
  port: port,
  clientLogLevel: clientLogLevel,
  headers: {
    'access-control-allow-origin': '*'
  }
}
export {
  cwd,
  isDev,
  publicPath,
  useHash,
  moduleFileExtensions,
  port,
  chunkName,
  clientOutPut,
  serverOutPut,
  webpackDevServerConfig
}
