import { resolve } from 'path'
import { rm } from 'shelljs'

export const cleanOutDir = async () => {
  // 默认清理 dist 文件夹
  const { accessFile, getCwd } = await import('ssr-server-utils')
  const cwd = getCwd()
  const tsconfigExist = await accessFile(resolve(cwd, './tsconfig.json'))
  if (tsconfigExist && process.env.CLEAN !== 'false') {
    const outDir = require(resolve(cwd, './tsconfig.json')).compilerOptions.outDir
    rm('-rf', resolve(cwd, outDir))
  }
}
