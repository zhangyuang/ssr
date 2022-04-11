import { resolve } from 'path'
import { promises } from 'fs'
import { mkdir, ln } from 'shelljs'

const cwd = process.cwd()
const accessFile = async (file: string) => {
  const result = await promises.access(file)
    .then(() => true)
    .catch(() => false)
  return result
}
(async () => {
  const example = await promises.readdir(resolve(cwd, './example'))
  for (const item of example) {
    if (item.includes('vue3')) {
      const path = resolve(cwd, `./example/${item}`)
      const swiperPath = resolve(path, './node_modules/swiper/node_modules')
      if (!await accessFile(swiperPath)) {
        mkdir(swiperPath)
      }
      ln('-s', resolve(path, './node_modules/vue'), resolve(swiperPath, './vue'))
    }
  }

})()
