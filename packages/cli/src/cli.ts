#!/usr/bin/env node

import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { parseYml, parseRoutesFromYml, parseFeRoutes, processError, checkDependencies } from 'ssr-server-utils'

const spinner = require('ora')('正在构建')

const commandPrePare = () => {
  checkDependencies()
  const ymlContent = parseYml('./f.yml')
  const ymlRoutes = parseRoutesFromYml(ymlContent)
  return ymlRoutes
}

try {
  yargs
    .command('start', 'Start Server', {}, async (argv: Argv) => {
      spinner.start()
      process.env.NODE_ENV = 'development'
      await parseFeRoutes(argv)
      const ymlRoutes = commandPrePare()
      const { start } = require('./start')
      argv.faasRoutes = ymlRoutes
      spinner.stop()
      await start(argv)
    })
    .command('build', 'build server and client files', {}, async (argv: Argv) => {
      spinner.start()
      process.env.NODE_ENV = 'production'
      const ymlRoutes = commandPrePare()
      const { build } = require('./build')
      argv.faasRoutes = ymlRoutes
      await parseFeRoutes(argv)
      spinner.stop()
      await build(argv)
    })
    .command('deploy', 'deploy function to aliyun cloud or tencent cloud', {}, async () => {
      const { deploy } = require('./deploy')
      await deploy()
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .option('version', {
      alias: 'v',
      default: false
    })
    .parse()
} catch (error) {
  processError(error)
}
