const WebFramework = require('@midwayjs/web').Framework
const web = new WebFramework().configure({
  port: 3000
})

const { Bootstrap } = require('@midwayjs/bootstrap')
Bootstrap.load(web).run()
