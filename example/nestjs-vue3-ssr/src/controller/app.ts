import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { Readable } from 'stream'
import { render } from 'ssr-core-vue3'

import { ApiDetailService } from '../service/detail'
import { ApiService } from '../service/index'

@Controller('/')
export class AppController {
  constructor (private readonly apiDeatilservice: ApiDetailService, private readonly apiService: ApiService) {}

  @Get('/')
  async handlerIndex (@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const ctx = {
        request: req,
        response: res,
        apiDeatilservice: this.apiDeatilservice,
        apiService: this.apiService
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

  @Get('/detail/:id')
  async handlerDetail (@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      const ctx = {
        request: req,
        response: res,
        apiDeatilservice: this.apiDeatilservice,
        apiService: this.apiService
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
