import { Argv } from 'ssr-types'

export const handleEnv = async (argv: Argv) => {
  process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack'
  const { loadConfig } = await import('ssr-server-utils')
  const { https, isDev } = loadConfig()
  if (!!https && isDev) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}
