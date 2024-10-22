import { Readable } from 'stream'
import { Controller, Get, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'
import { render } from 'ssr-core'

import { ApiService } from './index.service'

@Controller('/')
export class AppController {
	constructor(private readonly apiService: ApiService) {}

	@Get('/')
	async handlerIndex(@Req() req: Request, @Res() res: Response): Promise<any> {
		try {
			const ctx = {
				request: req,
				response: res,
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
