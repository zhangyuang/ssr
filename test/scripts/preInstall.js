#!/usr/bin/env node

const { exec } = require('child_process')
const { promisify } = require('util')
const fs = require('fs')
const execWithPromise = promisify(exec)

const install = (path, shell, afterHooks) => {
  fs.stat(path, async err => {
    if (err) {
      const { stdout } = await execWithPromise(shell)
      console.log(stdout)
    }
    if (afterHooks) {
      const { stdout } = await execWithPromise(afterHooks)
      console.log(stdout)
    }
  })
}

const preInstall = async () => {
  install('./packages/ykfe-utils/node_modules', 'cd ./packages/ykfe-utils && npm i')
  install('./packages/yk-cli/node_modules', 'cd ./packages/yk-cli && npm i')
  install('./example/ssr-with-js/node_modules', 'cd ./example/ssr-with-js && npm i && npm run build')
}

preInstall().catch(err => {
  console.log('err', err)
  process.exit()
})
