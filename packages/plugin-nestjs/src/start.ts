import { exec } from 'child_process'
import { logGreen, loadConfig } from 'ssr-server-utils'

const spinner = require('ora')('starting ')

const start = () => {
  const { serverPort, nestStartTips } = loadConfig()
  spinner.start()
  const { stdout, stderr } = exec('npx nest start --watch', {
    env: { ...process.env, FORCE_COLOR: '1' }
  })
  stdout?.on('data', function (data) {
    console.log(data)
    if (data.match('Nest application successfully started')) {
      spinner.stop()
      const https = process.env.HTTPS
      logGreen(nestStartTips ?? `Server is listening on ${https ? 'https' : 'http'}://localhost:${serverPort}`)
    }
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
  })
}

export {
  start
}
