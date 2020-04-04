import * as fs from 'fs'
import { promisify } from 'util'

const promisifyFsReadDir = promisify(fs.readdir)

export {
  promisifyFsReadDir
}
