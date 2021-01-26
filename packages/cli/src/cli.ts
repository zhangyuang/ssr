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
    await config.buildConfig.fePlugin.start?.(config)
    await config.buildConfig.serverPlugin.start?.(config)
  })
  .command('build', 'build server and client files', {}, async () => {
    spinnerProcess.send({
      message: 'start'
    })
    process.env.NODE_ENV = 'production'
    const config = loadConfig()
    await parseFeRoutes()
    spinnerProcess.send({
      message: 'stop'
    })
    await config.buildConfig.fePlugin.build?.(config)
    await config.buildConfig.serverPlugin.build?.(config)
  })
  .command('deploy', 'deploy function to aliyun cloud or tencent cloud', {}, async (argv: Argv) => {
    const config = loadConfig()
    if (!config.buildConfig.serverPlugin.deploy) {
      console.log('当前插件不支持 deploy 功能，请使用 ssr-plugin-faas 插件 并创建对应 yml 文件 参考 https://www.yuque.com/midwayjs/faas/migrate_egg 或扫码进群了解')
      return
    }
    process.env.NODE_ENV = 'production'
    await config.buildConfig.serverPlugin.deploy?.(argv)
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false
  })
  .fail((msg, err) => {
    if (err) {
      console.log(err)
      spinnerProcess.send({
        message: 'stop'
      })
      process.exit(1)
    }
  })
  .parse()
