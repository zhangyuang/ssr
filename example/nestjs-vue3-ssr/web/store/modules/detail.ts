const detailStore = {
	namespaced: true,
	state: {
		data: {}
	},
	mutations: {
		setData(state, payload) {
			state.data = payload
		}
	},
	actions: {
		initialData({ commit }, { payload }) {
			commit('setData', payload)
		}
	}
}

export { detailStore }
