import shell from 'shelljs'
import fs from 'fs'
import { resolve } from 'path'
import { execSync }from 'child_process'
import { cacheMange } from '../src/cache'
import { resolveApp } from '../src/util'

const cwd = process.cwd()
jest.mock('../src/util/index', () => ({
  getWithPromise: jest.requireActual('../src/util').getWithPromise,
  resolveApp: jest.requireActual('../src/util').resolveApp,
  getVersionEffective: jest.requireActual('../src/util').getVersionEffective,
  downloadWithPromise: jest.fn(() => {
    shell.mkdir('-p', resolveApp(`./cache/example/ssr-with-js`))
    shell.touch(resolveApp(`./cache/example/ssr-with-js/package.json`))
    execSync(`echo '{"version": "1.0.0"}' > ${resolveApp(`./cache/example/ssr-with-js/package.json`)}`)
  })
}))

test('hope cacheManage can move project directory to the true appName', async () => {
  // 本地没有缓存的情况应该下载仓库并且移动到指定的目录中
  await cacheMange({
    appName: 'app',
    language: 'javascript'
  })
  fs.stat('./app', err => {
    expect(err).toBe(null)
  })
  const { version } = require(resolve(cwd,'./app/package.json'))
  expect(version).toEqual('1.0.0')
})

afterAll(() => {
  shell.rm('-rf', resolveApp('./cache'))
  shell.rm('-rf', './app')
})
