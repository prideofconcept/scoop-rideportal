import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	store: {
		user: null,
		events: []
	},
	getters: {},
	mutations: {
		setUser (state, payload) {
			state.user = payload
		}
	},
	actions: {
		userLoggedin ({commit}, payload) {
			commit('setUser', payload)
		}
	}
})
