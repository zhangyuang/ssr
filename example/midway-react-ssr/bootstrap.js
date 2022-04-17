const { Bootstrap } = require('@midwayjs/bootstrap')

Bootstrap
  .configure({
    globalConfig: {
      koa: {
        port: 3000
      }
    }
  })
  .run()
