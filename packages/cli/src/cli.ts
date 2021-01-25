#!/usr/bin/env node
import { fork } from 'child_process'
import { resolve } from 'path'
import * as yargs from 'yargs'
import { parseFeRoutes, loadConfig } from 'ssr-server-utils'
import { Argv } from 'ssr-types'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 require 占用进程导致 loading 暂停

yargs
  .command('start', 'Start Server', {}, async () => {
    spinnerProcess.send({
      message: 'start'
    })
    process.env.NODE_ENV = 'development'
    const config = loadConfig()
    await parseFeRoutes()
    spinnerProcess.send({
      message: 'stop'
    })
    await config.fePlugin.start(config)
    await config.faasPlugin.start(config)
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
  .fail((msg, err, yargs) => {
    console.log(err)
    spinnerProcess.send({
      message: 'stop'
    })
    process.exit(1)
  })
  .parse()
