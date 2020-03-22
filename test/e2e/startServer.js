#!/usr/bin/env node

const egg = require('egg')
const { resolve } = require('path')
const { exec, fork, spawn } = require('child_process')
const { promisify } = require('util')
const execWithPromise = promisify(exec)
const baseDir = process.env.BASE_DIR = resolve(__dirname, '../../example/ssr-with-js/')
const cwd = process.cwd()
egg.startCluster({
  baseDir: baseDir,
  port: 7001,
  workers: 1
}, async () => {
  try {
    await execWithPromise('cd ./example/ssr-with-js && npm run build:server')
    const child = fork('./packages/yk-cli/src/clientRender', {
      env: Object.assign(process.env, {
        BASE_CWD: resolve(cwd, './example/ssr-with-js')
      })
    })
    child.send({
      msg: 'start dev'
    })
    child.on('message', async data => {
      if (data.msg === 'start dev finish') {
        const runner = spawn('./node_modules/.bin/nightwatch', ['--config', './test/e2e/nightwatch.config.js'], {
          stdio: 'inherit'
        })
        runner.on('exit', code => {
          process.exit(code)
        })
        runner.on('error', err => {
          throw err
        })
      }
    })
    process.on('exit', () => {
      child.kill()
    })
  } catch (error) {
    console.log('err', error)
    process.exit()
  }
})
