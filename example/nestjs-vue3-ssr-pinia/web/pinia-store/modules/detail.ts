
import { defineStore } from 'pinia'
import { Ddata } from '~/typings/data'

export const useDetailStore = defineStore('detailStore', {
  state: () => {
    return { data: {} } as Ddata
  },
  actions: {
    setData (payload: any) {
      this.data = payload.data
    }
  }
})
