import { readdirSync } from 'fs'
import { resolve } from 'path'
import { build } from 'esbuild'
import * as glob from 'glob'

const cwd = process.cwd()
const folders = readdirSync(resolve(cwd, './packages'))

for (const folder of folders) {
  if (folder !== '.DS_Store') {
    const files = glob.sync(`./packages/${folder}/{cjs,esm}/**/*.js`)
    for (const file of files) {
      build({
        entryPoints: [file],
        minify: true,
        platform: 'node',
        outfile: file,
        bundle: false,
        target: 'node14',
        allowOverwrite: true
      })
    }

  }
}
