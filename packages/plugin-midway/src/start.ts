import { join } from 'path'
import { execSync } from 'child_process'
import { loadConfig, getCwd, judgeVersion, accessFile, writeEmitter } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const start = async (argv: Argv) => {
  const { cli } = require('@midwayjs/cli/bin/cli')
  const cwd = getCwd()
  const config = loadConfig()
  const { optimize } = config
  if (judgeVersion(require(join(cwd, './package.json')).dependencies['@midwayjs/decorator'])?.major === 2) {
    execSync('npx cross-env ets')
  }
  argv._[0] = 'dev'
  argv.ts = true
  argv.port = config.serverPort
  argv.ssl = !!config.https
  argv.tsConfig = await accessFile(join(cwd, './tsconfig.build.json')) ? join(cwd, './tsconfig.build.json') : join(cwd, './tsconfig.json')
  if (optimize) {
    writeEmitter.on('writeEnd', async () => {
      writeEmitter.removeAllListeners()
      await cli(argv)
    })
  } else {
    await cli(argv)
  }
}

export {
  start
}
