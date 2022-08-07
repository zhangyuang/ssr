import { resolve } from 'path'
import { promises } from 'fs'
import { mkdir, ln, ls } from 'shelljs'
import { accessFile } from './releaseUtils'

const cwd = process.cwd();

(async () => {
  const example = await promises.readdir(resolve(cwd, './example'))
  for (const item of example) {
    const path = resolve(cwd, `./example/${item}`)
    if (item.includes('midway-vue3-ssr')) {
      const swiperPath = resolve(path, './node_modules/swiper/node_modules')
      if (!await accessFile(swiperPath)) {
        mkdir(swiperPath)
      }
      ln('-s', resolve(path, './node_modules/vue'), resolve(swiperPath, './vue'))
    } else if (item.includes('midway-vue-ssr')) {
      ln('-s', resolve(path, './node_modules/vue'), resolve(cwd, './node_modules/vue-template-compiler/node_modules/vue'))
      ln('-s', resolve(path, './node_modules/vue'), resolve(cwd, './node_modules/vue-server-renderer/node_modules/vue'))
    }
  }
})()
