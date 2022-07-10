const { Bootstrap } = require('@midwayjs/bootstrap')
const { loadConfig } = require('ssr-server-utils')

const { serverPort } = loadConfig()

Bootstrap
  .configure({
    globalConfig: {
      koa: {
        port: serverPort
      }
    }
  })
  .run()
