import { getCwd } from '@ssr/utils'

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
const port = 7001
const dist = 'bundle/client'
const root = getCwd()
const chunkName = 'Page'

type ClientLogLevel = 'error'
const clientLogLevel: ClientLogLevel = 'error'

const webpackDevServerConfig = {
  quiet: true,
  disableHostCheck: true,
  publicPath: publicPath,
  hotOnly: true,
  host: '0.0.0.0',
  sockPort: port,
  contentBase: `${root}/${dist}`,
  hot: true,
  port: port,
  clientLogLevel: clientLogLevel,
  headers: {
    'access-control-allow-origin': '*'
  }
}
export {
  root,
  isDev,
  publicPath,
  moduleFileExtensions,
  port,
  dist,
  chunkName,
  webpackDevServerConfig
}
