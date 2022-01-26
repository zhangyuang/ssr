import { Argv } from 'ssr-types'

export const handleEnv = async (argv: Argv) => {
  process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack'
  if (argv.analyze) {
    process.env.GENERATE_ANALYSIS = '1'
  }
  if (argv.html) {
    process.env.SPA = '1'
  }
  const { loadConfig } = await import('ssr-server-utils')
  const { https, isDev } = loadConfig()
  if (!!https && isDev) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}
