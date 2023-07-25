import { resolve } from 'path'
import { rm } from 'shelljs'

export const cleanOutDir = async () => {
  // 默认清理 dist 文件夹
  const { accessFile, getCwd, loadConfig } = await import('ssr-common-utils')
  const { staticConfigPath } = loadConfig()
  const cwd = getCwd()
  const tsconfigExist = await accessFile(resolve(cwd, './tsconfig.json'))
  if (tsconfigExist && process.env.CLEAN !== 'false') {
    try {
      const outDir = require(resolve(cwd, './tsconfig.json')).compilerOptions.outDir
      rm('-rf', resolve(cwd, outDir))
    } catch (error) {
      // 有可能 json 文件存在注释导致 require 失败，这里 catch 一下
      console.log('检测到当前目录 tsconfig.json 文件可能存在语法错误')
    }
  }
  if (!accessFile(staticConfigPath)) {
    // if check build/static.js exist, don't delete build folder
    rm('-rf', resolve(cwd, './build'))
  }
}
