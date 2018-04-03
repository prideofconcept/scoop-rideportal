import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './firebase'

Vue.use(Vuex)

export default new Vuex.Store({
	store: {
		user: null,
		events: []
	},
	getters: {
		user (state) {
			return state.user || firebase.auth().currentUser
		},
		isUserAuthed (state) {
			return (state.user !== null && state.user !== undefined)
		}
	},
	mutations: {
		setUser (state, payload) {
			state.user = payload

				/*[types.LOGIN_SUCCESS] (state, payload) {
				state.token = payload.token
				state.user = payload.user
				state.authenticated = true
				localstorage.setItem('token', payload.token)
				localstorage.setItem('user', payload.user)*/
		}
	},
	actions: {
		LOGIN_SUCCESS ({commit}, payload) {
			commit('setUser', payload)
		}
	}
})
