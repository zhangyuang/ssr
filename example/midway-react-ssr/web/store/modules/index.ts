import { IndexData } from '~/typings/data'

import { proxy } from 'valtio'

export const state = proxy({
	data: {} as IndexData
})
