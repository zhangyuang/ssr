#!/usr/bin/env node
import { resolve } from 'path'
import { fork } from 'child_process'
import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { generateHtml } from './html'
import { cleanOutDir } from './clean'
import { handleEnv } from './preprocess'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 同步代码 block 导致 loading 暂停

const spinner = {
  start: () => spinnerProcess.send({
    message: 'start'
  }),
  stop: () => spinnerProcess.send({
    message: 'stop'
  })
}

const startFunc = async (argv: Argv) => {
  spinner.start()
  process.env.NODE_ENV = 'development'
  if (!argv.noclean) {
    await cleanOutDir()
  }
  const { parseFeRoutes, loadPlugin, copyReactContext, transformConfig } = await import('ssr-server-utils')
  transformConfig()
  await handleEnv(argv)
  await parseFeRoutes()
  const plugin = loadPlugin()
  spinner.stop()
  if (plugin.clientPlugin?.name === 'plugin-react') {
    await copyReactContext()
  }
  await plugin.clientPlugin?.start?.(argv)
  await plugin.serverPlugin?.start?.(argv)
}

const buildFunc = async (argv: Argv) => {
  spinner.start()
  process.env.NODE_ENV = 'production'
  if (!argv.noclean) {
    await cleanOutDir()
  }
  const { parseFeRoutes, loadPlugin, copyReactContext, transformConfig } = await import('ssr-server-utils')
  transformConfig()
  await handleEnv(argv)
  await parseFeRoutes()
  const plugin = loadPlugin()
  spinner.stop()
  if (plugin.clientPlugin?.name === 'plugin-react') {
    await copyReactContext()
  }
  await plugin.clientPlugin?.build?.(argv)
  await plugin.serverPlugin?.build?.(argv)
  await generateHtml(argv)
}

const deployFunc = async (argv: Argv) => {
  process.env.NODE_ENV = 'production'
  const { loadPlugin } = await import('ssr-server-utils')
  const plugin = loadPlugin()

  if (!plugin?.serverPlugin?.deploy) {
    console.log('当前插件不支持 deploy 功能，请使用 ssr-plugin-midway 插件 参考 https://www.yuque.com/midwayjs/faas/migrate_egg 或扫码进群了解')
    return
  }
  await plugin.serverPlugin?.deploy?.(argv)
  spinner.stop()
}

yargs
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    await startFunc(argv)
  })
  .command('build', 'Build server and client files', {}, async (argv: Argv) => {
    await buildFunc(argv)
  })
  .command('deploy', 'Deploy function to aliyun cloud or tencent cloud', {}, async (argv: Argv) => {
    await deployFunc(argv)
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

export {
  startFunc,
  buildFunc,
  deployFunc
}
