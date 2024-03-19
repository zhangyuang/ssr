import { promises } from 'fs'
import { resolve } from 'path'
import { Argv } from 'ssr-types'

export const handleEnv = async (argv: Argv) => {
  const { loadConfig, getCwd } = await import('ssr-common-utils')
  const { https, isDev } = loadConfig()
  const cwd = getCwd()
  process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack'
  process.env.OPTIMIZE = (process.env.BUILD_TOOL === 'webpack' && argv.optimize) ? '1' : '0'
  if (argv.ssg) {
    process.env.SSG = '1'
  }
  if (isDev) {
    process.env.GENERATE_SOURCEMAP = 'eval-source-map'
  }
  if (argv.sourcemap) {
    if (argv.sourcemap.includes?.('source-map')) {
      process.env.GENERATE_SOURCEMAP = argv.sourcemap
    } else if (!isDev) {
      process.env.GENERATE_SOURCEMAP = 'source-map'
    }
  }
  if (argv.analyze) {
    process.env.GENERATE_ANALYSIS = '1'
  }
  if (argv.html) {
    process.env.SPA = '1'
  }
  if (argv.legacy) {
    process.env.LEGACY_VITE = '1'
  }
  if (argv.nominify) {
    process.env.NOMINIFY = '1'
  }

  process.env.SERVER_PORT = argv.port ? String(argv.port) : '3000'
  if (argv.vite) {
    await promises.writeFile(resolve(cwd, './build/tag.json'), JSON.stringify({
      BUILD_TOOL: process.env.BUILD_TOOL
    }, null, 2))
  }
  if (!!https && isDev) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}
