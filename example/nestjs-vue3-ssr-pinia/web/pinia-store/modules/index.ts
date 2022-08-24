
import { defineStore } from 'pinia'
import { IndexData } from '~/typings/data'

export const useIndexStore = defineStore('indexStore', {
  state: () => {
    return { data: {} } as IndexData
  },
  actions: {
    setData (payload: any) {
      this.data = payload.data
    }
  }
})
