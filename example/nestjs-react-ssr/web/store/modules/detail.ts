import { Ddata } from '~/typings/data'

import { proxy } from 'valtio'

export const state = proxy({
  data: {} as Ddata
})
