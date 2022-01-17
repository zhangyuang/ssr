import { exec } from 'child_process'
import { logGreen, loadConfig } from 'ssr-server-utils'
import { Argv } from 'ssr-types'
import { getNormalizeArgv } from './utils'

const spinner = require('ora')('starting ')
const singleDash = ['c', 'p', 'w', 'd', 'e', 'h']
const doubleDash = ['config', 'path', 'watch', 'watchAssets', 'debug', 'webpack', 'webpackPath', 'tsc', 'exec', 'preserveWatchOutput', 'help']

const start = (argv: Argv) => {
  const { serverPort, nestStartTips } = loadConfig()
  spinner.start()
  const normalizeArgv = getNormalizeArgv(argv, {
    singleDash,
    doubleDash
  })
  const { stdout, stderr } = exec(`npx nest start --watch ${normalizeArgv}`, {
    env: { ...process.env, FORCE_COLOR: '1' }
  })
  stdout?.on('data', function (data) {
    console.log(data)
    if (data.match('Nest application successfully started')) {
      spinner.stop()
      const https = process.env.HTTPS
      logGreen(nestStartTips ?? `Server is listening on ${https ? 'https' : 'http'}://127.0.0.1:${serverPort}`)
    }
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
  })
}

export {
  start
}
