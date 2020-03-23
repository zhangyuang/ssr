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
const root = process.cwd()
const isDev = process.env.NODE_ENV === 'development'
const PORT = 7001
const dist = 'dist'
export const appConfig = {
  root,
  isDev,
  publicPath,
  moduleFileExtensions,
  PORT,
  dist
}
