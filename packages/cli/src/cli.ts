#!/usr/bin/env node

import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { parseYml, parseRoutesFromYml, parseFeRoutes, processError, getCwd, checkDependencies } from 'ssr-server-utils'
import { init } from './init'

const commandPrePare = () => {
  checkDependencies()
  const ymlContent = parseYml('./f.yml')
  const ymlRoutes = parseRoutesFromYml(ymlContent)
  return ymlRoutes
}
try {
  yargs
    .command('init', 'init Project', {}, async (argv: Argv) => {
      await init()
    })
    .command('start', 'Start Server', {}, async (argv: Argv) => {
      process.env.NODE_ENV = 'development'
      const ymlRoutes = commandPrePare()
      const { start } = require('./start')
      argv.faasRoutes = ymlRoutes
      await parseFeRoutes(argv)
      await start(argv)
    })
    .command('build', 'build server and client files', {}, async (argv: Argv) => {
      process.env.NODE_ENV = 'production'
      const ymlRoutes = commandPrePare()
      const { build } = require('./build')
      argv.faasRoutes = ymlRoutes
      await parseFeRoutes(argv)
      await build(argv)
    })
    .command('deploy', 'deploy function to aliyun cloud or tencent cloud', {}, async () => {
      const cwd = getCwd()
      const { CommandHookCore, loadSpec } = require('@midwayjs/fcli-command-core')
      const { PackagePlugin } = require('@midwayjs/fcli-plugin-package')
      const { DeployPlugin } = require('@midwayjs/fcli-plugin-deploy')
      const { AliyunFCPlugin } = require('@midwayjs/fcli-plugin-fc')

      const core: any = new CommandHookCore({
        config: {
          servicePath: cwd
        },
        commands: ['deploy'],
        service: loadSpec(cwd),
        provider: 'aliyun',     // 指定 provider
        log: console
      })
      core.addPlugin(PackagePlugin)
      core.addPlugin(DeployPlugin)
      core.addPlugin(AliyunFCPlugin)
      await core.ready()
      await core.invoke(['deploy'])
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
