import { resolve } from 'path'
import { exec } from 'shelljs'
import { logGreen, loadConfig, getCwd } from 'ssr-common-utils'
import type { Argv } from 'ssr-types'
import { coerce } from 'semver'
import { getNormalizeArgv, getNestjsVersion } from './utils'

const v = getNestjsVersion()
const morethan10 = (coerce(v)?.major ?? 8) >= 10
const spinner = require('ora')('starting ')
const singleDash = ['c', 'p', 'w', 'd', 'e', 'h'].concat(morethan10 ? 'b' : '')
const doubleDash = ['config', 'path', 'watch', 'watchAssets', 'debug', 'webpack',
  'webpackPath', 'tsc', 'exec', 'preserveWatchOutput', 'help'].concat(morethan10 ? 'builder' : '')

const start = async (argv: Argv) => {
  const cwd = getCwd()
  const { serverPort, nestStartTips } = loadConfig()
  spinner.start()
  if (morethan10) {
    argv.b = argv.b || 'swc'
  } // use swc as default compiler when nestjs >=10

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
    if (!data.includes('has been deprecated') && !data.includes('reflect-metadata doesn\'t appear to be written in CJS')) {
      console.error(`error: ${data}`)
    }
  })
}

export {
  start
}
