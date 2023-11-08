import { Controller, Get, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { render } from 'ssr-core'

import { ApiService } from './index.service'

@Controller('/')
export class AppController {
  constructor (private readonly apiService: ApiService) {}

  @Get('/')
  async handlerIndex (@Req() req: Request, @Res() res: Response): Promise<any> {
    // 降级策略参考文档 http://doc.ssr-fc.com/docs/features$csr#%E5%A4%84%E7%90%86%20%E6%B5%81%20%E8%BF%94%E5%9B%9E%E5%BD%A2%E5%BC%8F%E7%9A%84%E9%99%8D%E7%BA%A7
    const ctx = {
      request: req,
      response: res,
      apiService: this.apiService
    }
    try {
      const stream = await render(ctx, {
        stream: true
      })
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.end()
      })
    } catch (error) {
      console.log('ssr error', error)
      const stream = await render(ctx, {
        stream: true,
        mode: 'csr'
      })
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.end()
      })
    }
  }
}
