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
const dist = 'dist'
const root = getCwd()
export const appConfig = {
  root,
  isDev,
  publicPath,
  moduleFileExtensions,
  port,
  dist
}
