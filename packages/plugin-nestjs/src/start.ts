import { resolve } from 'path'
import { exec } from 'shelljs'
import { logGreen, loadConfig, getCwd } from 'ssr-common-utils'
import { Argv } from 'ssr-types'
import { getNormalizeArgv } from './utils'

const spinner = require('ora')('starting ')
const singleDash = ['c', 'p', 'w', 'd', 'e', 'h']
const doubleDash = ['config', 'path', 'watch', 'watchAssets', 'debug', 'webpack', 'webpackPath', 'tsc', 'exec', 'preserveWatchOutput', 'help']

const start = (argv: Argv) => {
  const cwd = getCwd()
  const { serverPort, nestStartTips } = loadConfig()
  spinner.start()
  const normalizeArgv = getNormalizeArgv(argv, {
    singleDash,
    doubleDash
  })
  const { stdout, stderr } = exec(`${resolve(cwd, './node_modules/.bin/nest')} start --watch ${normalizeArgv}`, { async: true, silent: true, env: { ...process.env, FORCE_COLOR: '1' } })

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
