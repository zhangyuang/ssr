const indexStore = {
  namespaced: true,
  state: {
    data: {}
  },
  mutations: {
    setData (state, payload) {
      state.data = payload.data
    }
  },
  actions: {
    initialData ({ commit }, { payload }) {
      commit('setData', payload)
    }
  }
}

export {
  indexStore
}
