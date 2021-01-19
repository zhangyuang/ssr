#!/usr/bin/env node
import { fork } from 'child_process'
import { resolve } from 'path'
import * as yargs from 'yargs'
import { Argv } from 'ssr-types'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 require 占用进程导致 loading 暂停

try {
  yargs
    .command('start', 'Start Server', {}, async () => {
      spinnerProcess.send({
        message: 'start'
      })
      process.env.NODE_ENV = 'development'
      const { parseFeRoutes } = require('ssr-server-utils') // 延迟 require 防止 process.env.NODE_ENV 设置未生效
      await parseFeRoutes()
      const { start } = require('./start')
      spinnerProcess.send({
        message: 'stop'
      })
      await start()
    })
    .command('build', 'build server and client files', {}, async () => {
      spinnerProcess.send({
        message: 'start'
      })
      process.env.NODE_ENV = 'production'
      const { build } = require('./build')
      const { parseFeRoutes } = require('ssr-server-utils')
      await parseFeRoutes()
      spinnerProcess.send({
        message: 'stop'
      })
      await build()
    })
    .command('deploy', 'deploy function to aliyun cloud or tencent cloud', {}, async (argv: Argv) => {
      const { deploy } = require('./deploy')
      await deploy(argv)
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .option('version', {
      alias: 'v',
      default: false
    })
    .parse()
} catch (error) {
  console.log(error)
  process.exit(1)
}
