import { invoke } from '@midwayjs/serverless-invoke'
// import * as assert from 'assert'
import { join } from 'path'

invoke({
  functionName: 'spa',
  functionDir: join(__dirname, './')
}).then(res => console.log(res))
