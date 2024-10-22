import { Provide } from '@midwayjs/decorator'
import { Ddata } from '~/typings/data'
import mock from '../mock/detail'

@Provide('ApiDetailService')
export class ApiDetailService {
	async index(id): Promise<Ddata> {
		return await Promise.resolve(mock.data[id])
	}
}
