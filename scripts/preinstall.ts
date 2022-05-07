import { resolve } from 'path'
import { promises } from 'fs'

const accessFile = async (file: string) => {
  const result = await promises.access(file)
    .then(() => true)
    .catch(() => false)
  return result
}
const cwd = process.cwd();
(async () => {
  if (!await accessFile(resolve(cwd, './packages/cli/cjs'))) {
    await promises.mkdir(resolve(cwd, './packages/cli/cjs'))
  }
  if (!await accessFile(resolve(cwd, './packages/cli/cjs/cli.js'))) {
    console.log('create default bin file')
    await promises.writeFile(resolve(cwd, './packages/cli/cjs/cli.js'), '#! /usr/bin/env node')
  }
})()
