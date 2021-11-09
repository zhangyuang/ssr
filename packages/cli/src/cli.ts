#!/usr/bin/env node
import { resolve } from 'path'
import { fork } from 'child_process'
import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { handleEnv } from './env'
import { generateHtml } from './html'
import { cleanOutDir } from './clean'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 同步代码 block 导致 loading 暂停

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
    await handleEnv(argv, spinner)

    const { parseFeRoutes, loadPlugin, copyReactContext } = await import('ssr-server-utils')
    await parseFeRoutes()

    await parseFeRoutes()
    const plugin = loadPlugin()
    spinner.stop()
    if (plugin.clientPlugin?.name === 'plugin-react') {
      await copyReactContext()
    }
    if (process.env['BUILD_TOOL'] !== 'vite') {
      await plugin.clientPlugin?.start?.(argv)
    }
    await cleanOutDir()
    await plugin.serverPlugin?.start?.(argv)
  })
  .command('build', 'Build server and client files', {}, async (argv: Argv) => {
    spinner.start()
    process.env.NODE_ENV = 'production'
    const { parseFeRoutes, loadPlugin, copyReactContext } = await import('ssr-server-utils')
    await parseFeRoutes()
    const plugin = loadPlugin()
    spinner.stop()
    if (plugin.clientPlugin?.name === 'plugin-react') {
      await copyReactContext()
    }
    if (process.env['BUILD_TOOL'] === 'vite') {
      await cleanOutDir()
      await plugin.serverPlugin?.build?.(argv)
      await generateHtml(argv)
    } else {
      await plugin.clientPlugin?.build?.(argv)
      await cleanOutDir()
      await plugin.serverPlugin?.build?.(argv)
      await generateHtml(argv)
    }
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
