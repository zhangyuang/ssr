#!/usr/bin/env node
import { resolve } from 'path'
import { fork } from 'child_process'
import * as yargs from 'yargs'
import { Argv } from 'ssr-types'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 require 占用进程导致 loading 暂停
const debug = require('debug')('ssr:cli')
const start = Date.now()
const spinner = {
  start: () => spinnerProcess.send({
    message: 'start'
  }),
  stop: () => spinnerProcess.send({
    message: 'stop'
  })
}

yargs
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    spinner.start()
    // 只有本地开发环境才会使用 Vite
    process.env.BUILD_TOOL = argv.vite ? 'vite' : 'webpack'
    process.env.NODE_ENV = 'development'

    const { copyViteConfig, checkVite, loadConfig } = await import('ssr-server-utils')
    const { https } = loadConfig()

    if ((typeof https === 'boolean' && https) || (typeof https === 'object' && Object.keys(https).length !== 0)) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }

    if (argv.test) {
      // 开发同学本地 link 测试用
      process.env.TEST = '1'
    }

    if (process.env.BUILD_TOOL === 'vite') {
      const result = await checkVite()
      if (!result) {
        spinner.stop()
        process.exit(1)
      }
      await copyViteConfig()
    }
    const { parseFeRoutes, loadPlugin } = await import('ssr-server-utils')
    debug(`require ssr-server-utils time: ${Date.now() - start} ms`)
    const plugin = loadPlugin()
    debug(`loadPlugin time: ${Date.now() - start} ms`)
    await parseFeRoutes()
    spinner.stop()
    debug(`parseFeRoutes ending time: ${Date.now() - start} ms`)
    await plugin.clientPlugin?.start?.(argv)
    debug(`clientPlugin ending time: ${Date.now() - start} ms`)
    await plugin.serverPlugin?.start?.(argv)
    debug(`serverPlugin ending time: ${Date.now() - start} ms`)
  })
  .command('build', 'Build server and client files', {}, async (argv: Argv) => {
    spinner.start()
    process.env.NODE_ENV = 'production'

    const { parseFeRoutes, loadPlugin } = await import('ssr-server-utils')
    const plugin = loadPlugin()
    await parseFeRoutes()

    spinner.stop()

    await plugin.clientPlugin?.build?.(argv)
    await plugin.serverPlugin?.build?.(argv)
  })
  .command('deploy', 'Deploy function to aliyun cloud or tencent cloud', {}, async (argv: Argv) => {
    process.env.NODE_ENV = 'production'
    const { loadPlugin } = await import('ssr-server-utils')
    const plugin = loadPlugin()

    if (!plugin?.serverPlugin?.deploy) {
      console.log('当前插件不支持 deploy 功能，请使用 ssr-plugin-midway 插件 参考 https://www.yuque.com/midwayjs/faas/migrate_egg 或扫码进群了解')
      return
    }
    process.env.NODE_ENV = 'production'
    await plugin.serverPlugin?.deploy?.(argv)
    spinner.stop()
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false
  })
  .fail((msg, err) => {
    if (err) {
      console.log(err)
      spinner.stop()
      process.exit(1)
    }
    console.log(msg)
  })
  .parse()
