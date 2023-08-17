#!/usr/bin/env node
import { resolve } from 'path'
import { fork } from 'child_process'
import * as yargs from 'yargs'
import { coerce } from 'semver'
import { Argv, IPlugin } from 'ssr-types'
import { generateHtml } from './html'
import { cleanOutDir } from './clean'
import { handleEnv } from './preprocess'
import { onWatcher, createWatcher } from './watcher'
import { ssg } from './ssg'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 同步代码 block 导致 loading 暂停

const spinner = {
  start: () => spinnerProcess.send({
    message: 'start'
  }),
  stop: () => spinnerProcess.send({
    message: 'stop'
  })
}

const startOrBuild = async (argv: Argv, type: 'start' | 'build') => {
  const { copyReactContext, judgeFramework, judgeServerFramework, logGreen, logWarning } = await import('ssr-common-utils')
  // for ssr generate default staticConfig file
  if (!argv.vite && coerce(process.version)?.major as number > 16 && !process.env.NODE_OPTIONS?.includes('--openssl-legacy-provider')) {
    logWarning(`crypto.createHash('md4') is not supported when node version > 16,
    Please use NODE_OPTIONS=--openssl-legacy-provider ssr start to start project
    If you are using windows please use set NODE_OPTIONS=--openssl-legacy-provider, ref https://github.com/webpack/webpack/issues/14532
    `)
  }
  const framework = judgeFramework()
  const serverFramework = judgeServerFramework()
  if (argv.ssg) {
    logGreen('Using ssg for generate static html file')
  }
  if (!argv.api) {
    const { clientPlugin } = await import(framework)
    const client: IPlugin['clientPlugin'] = clientPlugin()
    if (client?.name === 'plugin-react') {
      await copyReactContext()
    }
    await client?.[type]?.(argv)
  }
  if (!argv.web) {
    const { serverPlugin } = await import(serverFramework)
    const server: IPlugin['serverPlugin'] = serverPlugin()
    await server?.[type]?.(argv)
  }
  if (type === 'build') {
    await generateHtml()
    await ssg(argv)
  }
}

const startFunc = async (argv: Argv) => {
  if (!argv.vite) {
    spinner.start()
  }
  await cleanOutDir(argv)
  process.env.NODE_ENV = 'development'
  const { parseFeRoutes, transformConfig, logInfo } = await import('ssr-common-utils')
  await transformConfig()
  if (argv.vite) {
    logInfo('Vite 场景本地开发样式闪烁为正常现象请忽略，生产环境无此问题')
  }
  const watcher = await createWatcher()
  await handleEnv(argv)
  await parseFeRoutes()
  spinner.stop()
  await startOrBuild(argv, 'start')
  await onWatcher(watcher)
}

const buildFunc = async (argv: Argv) => {
  spinner.start()
  await cleanOutDir(argv)
  process.env.NODE_ENV = 'production'
  const { parseFeRoutes, transformConfig } = await import('ssr-common-utils')
  await transformConfig()
  await handleEnv(argv)
  await parseFeRoutes()
  spinner.stop()
  await startOrBuild(argv, 'build')
}

const deployFunc = async (argv: Argv) => {
  process.env.NODE_ENV = 'production'
  const { judgeServerFramework } = await import('ssr-common-utils')
  const serverFramework = judgeServerFramework()
  const { serverPlugin } = await import(serverFramework)
  const server: IPlugin['serverPlugin'] = serverPlugin()
  if (!server?.deploy) {
    console.log('当前插件不支持 deploy 功能，请使用 ssr-plugin-midway 插件 参考 https://www.yuque.com/midwayjs/faas/migrate_egg 或扫码进群了解')
    return
  }
  await server?.deploy?.(argv)
  spinner.stop()
}

const cliDesc = {
  web: {
    desc: 'only start client plugin'
  },
  api: {
    desc: 'only start server plugin'
  }
}
yargs
  .command('start', 'Start Server', yargs => yargs.options({
    vite: {
      desc: 'Start application by vite'
    },
    port: {
      desc: 'Setting application server port, default is 3000'
    },
    optimize: {
      alias: 'o',
      desc: 'Optimize webpack bundle for high performance'
    },
    help: {
      alias: 'h',
      desc: 'In midway, use --help to speed up ts compile'
    },
    ...cliDesc
  }), async (argv: Argv) => {
    await startFunc(argv)
  })
  .command('build', 'Build application by webpack or vite', yargs => yargs.options({
    analyze: {
      alias: 'a',
      desc: 'Analyze bundle result when using webpack for build'
    },
    optimize: {
      alias: 'o',
      desc: 'Optimize webpack bundle for high performance'
    },
    vite: {
      desc: 'Build application by vite'
    },
    legacy: {
      desc: 'Close default rollup manulChunks setting in vite mode'
    },
    html: {
      desc: 'Build application as a single html'
    },
    ssg: {
      desc: 'Build with Static Site Generation (Pre Render)'
    },
    sourcemap: {
      desc: 'Generate sourcemap in production environment'
    },
    ...cliDesc
  }), async (argv: Argv) => {
    const { logWarning } = await import('ssr-common-utils')
    if (argv.vite) {
      logWarning(`ssr build by vite is beta now, if you find some bugs, please submit an issue on https://github.com/zhangyuang/ssr/issues or you can use ssr build --vite --legacy which will close manualChunks
      to get a stable bundle result but maybe some performance loss
      `)
    }
    await buildFunc(argv)
  })
  .command('deploy', 'Deploy function to aliyun cloud or tencent cloud', yargs => yargs.options({
    tencent: {
      desc: 'deploy application to tencent clound'
    }
  }), async (argv: Argv) => {
    await deployFunc(argv)
  })
  .command('update', 'check dependencies version is latest', {}, async (argv: Argv) => {
    spinner.start()
    const { update } = await import ('./update')
    await update()
    spinner.stop()
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false,
    desc: 'Show current version'
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
