import shell from 'shelljs'
import { execSync } from 'child_process'
import { getWithPromise, getVersionEffective, resolveApp, renderTemplate, processError } from '../src/util'

// @ts-ignore
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  //
})

test('processError can exit process', () => {
  processError('error')
  expect(process.exit).toBeCalled()
})

describe('test getWithPromise', () => {
  test('hope getWithPromise can get true result', async () => {
    const data = await getWithPromise('https://registry.npm.taobao.org/ssr-with-js')
    expect(data.name).toEqual('ssr-with-js')
  })
  test('hope timeout error can be invoke', async () => {
    // 请求超时应该报错
    try {
      await getWithPromise('https://registry.npm.taobao.org/ssr-with-js', 1)
    } catch (error) {
      expect(error).toContain('url request timeout')
    }
  })
  test('request error url should reject', async () => {
    // 请求错误地址应该报错
    try {
      await getWithPromise('https://encrypte1d.google.com/')
    } catch (error) {
      expect(error.code).toEqual('ENOTFOUND')
    }
  })
})

describe('test getVersionEffective without cache', () => {
// 本地没有cache的情况应该返回false
  test('no cahe can return false', async () => {
    const data = await getVersionEffective({
      appName: 'app',
      language: 'javascript'
    })
    expect(data).toEqual(false)
  })
})

describe('test getVersionEffective with cache', () => {
  beforeEach(() => {
    jest.resetModules() // 清空缓存
    shell.mkdir('-p', resolveApp('./cache/example/ssr-with-js'))
    shell.touch(resolveApp(`./cache/example/ssr-with-js/package.json`))
  })
  test('cahe expired should return false', async () => {
    execSync(`echo '{"version":"1.0.0"}' > ${resolveApp(`./cache/example/ssr-with-js/package.json`)}`)
    // 缓存过期应该返回false
    const data = await getVersionEffective({
      appName: 'app',
      language: 'javascript'
    })
    expect(data).toEqual(false)
  })
  test('cahe not expire should return true', async () => {
    // 缓存没过期应该返回true
    const { 'dist-tags': { latest } } = await getWithPromise('https://registry.npm.taobao.org/ssr-with-js')
    execSync(`echo '{"version": "${latest}"}' > ${resolveApp(`./cache/example/ssr-with-js/package.json`)}`)
    const data = await getVersionEffective({
      appName: 'app',
      language: 'javascript'
    })
    expect(data).toEqual(true)
  })
  test('throw error should return true', async () => {
    // 执行报错应该返回true
    const data = await getVersionEffective({
      appName: 'app',
      language: 'javascript'
    })
    expect(data).toEqual(true)
  })
  afterEach(() => {
    shell.rm('-rf', resolveApp('./cache'))
  })
})

describe('test renderTemplate', () => {
  beforeAll(() => {
    shell.touch(resolveApp('./template.json.nj'))
    execSync(`echo {\\"appName\\": \\"{{appName}}\\" } > ${resolveApp('./template.json.nj')}`)
  })
  test('renderTemplate can generate the true file after rendering', () => {
    renderTemplate(resolveApp('./template.json.nj'), resolveApp('./template.json'), {
      appName: 'yk-cli',
      language: 'javascript'
    })
    const appName = require(resolveApp('./template.json')).appName
    expect(appName).toEqual('yk-cli')
  })
  afterAll(() => {
    shell.rm(resolveApp('./template.json.nj'))
    shell.rm(resolveApp('./template.json'))
  })
})
