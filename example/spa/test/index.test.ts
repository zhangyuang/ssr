// @ts-nocheck
import { invoke } from '@midwayjs/serverless-invoke'
import * as assert from 'assert'
import { join } from 'path'

describe('/test/index.test.ts', () => {
  it('invoke', async () => {
    const result: any = await invoke({
      functionName: 'index',
      functionDir: join(__dirname, '../'),
      data: [
        {
          path: '/home',
          method: 'GET'
        }
      ]
    })
    console.log(result.body)
    assert.match(result.body, /当前路由/)
  })
})
