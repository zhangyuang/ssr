import { DetailData } from '~/typings/data'
export interface IApiDetailService {
	index: (id: string) => Promise<DetailData>
}
