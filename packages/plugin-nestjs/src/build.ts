import { exec } from 'child_process'

const spinner = require('ora')('building')

const build = () => {
  spinner.start()
  exec('npx nest build', () => {
    spinner.stop()
  })
}

export {
  build
}
