const { invoke } = require('@midwayjs/serverless-invoke')

invoke({
  functionName: 'spa',
  functionDir: process.cwd()
}).then(res => {
  console.log(res)
})
