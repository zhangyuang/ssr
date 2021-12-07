import { exec } from 'child_process'
import { loadConfig } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const start = (argv: Argv) => {
  const { cli } = require('@midwayjs/cli/bin/cli')
  const config = loadConfig()
  exec('npx cross-env ets', async (err, stdout) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(stdout)
    // 透传参数给 midway-bin
    argv._[0] = 'dev'
    argv.ts = true
    argv.port = config.serverPort
    await cli(argv)
  })
}

export {
  start
}
