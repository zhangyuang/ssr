import { Injectable } from '@nestjs/common'
import { DetailData } from '~/typings/data'
import mock from './detail.mock'

@Injectable()
export class ApiDetailService {
	async index(id): Promise<DetailData> {
		return await Promise.resolve(mock.data[id])
	}
}
