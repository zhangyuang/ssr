import { exec } from 'child_process'
import { logGreen } from 'ssr-server-utils'

const spinner = require('ora')('starting ')

const start = () => {
  spinner.start()
  const { stdout, stderr } = exec('npx nest start --watch', {} /* options, [optional] */)
  stdout?.on('data', function (data) {
    console.log(data)
    if (data.match('Nest application successfully started')) {
      spinner.stop()
      const https = process.env.HTTPS
      logGreen(`Server is listening on ${https ? 'https' : 'http'}://localhost:3000`)
    }
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
  })
}

export {
  start
}
