import { Argv } from 'ssr-types'

export const handleEnv = async (argv: Argv, spinner: any) => {
  // 初始化环境变量设置
  // 只有本地开发环境才会使用 vite
  process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack'
  process.env.NODE_ENV = 'development'

  const { copyViteConfig, checkVite, loadConfig } = await import('ssr-server-utils')
  const { https } = loadConfig()

  if (https) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  if (process.env.BUILD_TOOL === 'vite') {
    const result = await checkVite()
    if (!result) {
      spinner.stop()
      process.exit(1)
    }
    await copyViteConfig()
  }
}
