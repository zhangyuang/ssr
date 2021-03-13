import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { Readable } from 'stream'
import { render } from 'ssr-core-vue3'

import { ApiDetailService } from './detail.service'

@Controller('/')
export class DetailController {
  constructor (private readonly apiDeatilservice: ApiDetailService) {}

  @Get('/detail/:id')
  async handlerDetail (@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const ctx = {
        request: req,
        response: res,
        apiDeatilservice: this.apiDeatilservice
      }
      const stream = await render<Readable>(ctx, {
        stream: true
      })
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.end()
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}
