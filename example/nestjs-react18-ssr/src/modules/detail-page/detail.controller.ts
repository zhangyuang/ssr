import { PassThrough } from 'stream'
import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { render } from 'ssr-core-react'

import { ApiDetailService } from './detail.service'

@Controller('/')
export class DetailController {
  constructor (private readonly apiDeatilservice: ApiDetailService) {}

  @Get('/detail/:id')
  async handlerDetail (@Req() req: Request, @Res() res: Response): Promise<any> {
    const ctx = {
      request: req,
      response: res,
      apiDeatilservice: this.apiDeatilservice
    }
    const passThrough = new PassThrough()
    const stream = await render(ctx, {
      stream: true,
      onError: (err) => {
        console.log('ssr error', err)
        render(ctx, {
          stream: true,
          mode: 'csr'
        }).then(csrStream => {
          const passThrough = new PassThrough()
          csrStream.pipe(passThrough)
          passThrough.pipe(res)
        })
        return null
      },
      onReady () {
        // for normal ssr end
        passThrough.pipe(res)
      }
    })
    stream.pipe(passThrough)
  }
}
